import * as tf from '@tensorflow/tfjs';
import * as tfd from '@tensorflow/tfjs-data';

export default class TensorflowAdapter {
  constructor() {
    this.init();

    this.webcam = null;
    this.truncatedMobileNet = null;
    this.denseUnits = 100;
    this.model = null;
    this.learningRate = 0.0001;
    this.batchSizeFraction = 0.4;
    this.epochs = 20;
    this.isPredicting = false;
    this.numClasses = 4;
    this.controllerDataset = new ControllerDataset(this.numClasses);
    this.examplesForClasses = {};
  }

  async init() {
    try {
      this.webcam = await tfd.webcam(document.getElementById('webcam'), {
        resizeWidth: 224,
        resizeHeight: 224
      });
    } catch (e) {
      console.log(e);
    }
    this.truncatedMobileNet = await this.loadTruncatedMobileNet();

    const screenShot = await this.webcam.capture();
    this.truncatedMobileNet.predict(screenShot.expandDims(0));
    screenShot.dispose();
  }

  async setExampleForModel(label) {
    const img = await this.getImageFromWebcam();
    this.controllerDataset.addExample(this.truncatedMobileNet.predict(img), label);
    this.examplesForClasses[label] += 1;
    img.dispose();
  }

  async getImageFromWebcam() {
    const img = await this.webcam.capture();
    const processedImg = tf.tidy(() => img.expandDims(0).toFloat().div(127).sub(1));
    img.dispose();
    return processedImg;
  }

  async loadTruncatedMobileNet() {
    const mobilenet = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
  }

  /**
   * Sets up and trains the classifier.
   */
  async train() {
    if (this.controllerDataset.xs == null) {
      throw new Error('Add some examples before training!');
    }

    // Creates a 2-layer fully connected model. By creating a separate model,
    // rather than adding layers to the mobilenet model, we "freeze" the weights
    // of the mobilenet model, and only train weights from the new model.
    this.model = tf.sequential({
      layers: [
        // Flattens the input to a vector so we can use it in a dense layer. While
        // technically a layer, this only performs a reshape (and has no training
        // parameters).
        tf.layers.flatten({inputShape: this.truncatedMobileNet.outputs[0].shape.slice(1)}),
        // Layer 1.
        tf.layers.dense({
          units: this.denseUnits,
          activation: 'relu',
          kernelInitializer: 'varianceScaling',
          useBias: true
        }),
        // Layer 2. The number of units of the last layer should correspond
        // to the number of classes we want to predict.
        tf.layers.dense({
          units: this.numClasses,
          kernelInitializer: 'varianceScaling',
          useBias: false,
          activation: 'softmax'
        })
      ]
    });

    const optimizer = tf.train.adam(this.learningRate);
    this.model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});

    const batchSize = Math.floor(this.controllerDataset.xs.shape[0] * this.batchSizeFraction);
    if (!(batchSize > 0)) {
      throw new Error(`Batch size is 0 or NaN. Please choose a non-zero fraction.`);
    }

    this.model.fit(this.controllerDataset.xs, this.controllerDataset.ys, {
      batchSize,
      epochs: this.epochs,
      callbacks: {
        onBatchEnd: async (batch, logs) => {
          console.log('Loss: ' + logs.loss.toFixed(5));
        }
      }
    });
  }

  setPredictingStatus() {
    this.isPredicting = true;
  }

  async predict() {
    while (this.isPredicting) {
      // Capture the frame from the webcam.
      const img = await getImageFromWebcam();

      // Make a prediction through mobilenet, getting the internal activation of
      // the mobilenet model, i.e., "embeddings" of the input images.
      const embeddings = this.truncatedMobileNet.predict(img);

      // Make a prediction through our newly-trained model using the embeddings
      // from mobilenet as input.
      const predictions = this.model.predict(embeddings);

      // Returns the index with the maximum probability. This number corresponds
      // to the class the model thinks is the most probable given the input.
      const predictedClass = predictions.as1D().argMax();
      const classId = (await predictedClass.data())[0];
      img.dispose();

      await tf.nextFrame();
    }
  }

  drawThumb(img, label) {
    const thumbCanvas = document.getElementById('thumb-0');
    this.draw(img, thumbCanvas);
  }

  draw(image, canvas) {
    const [width, height] = [224, 224];
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(width, height);
    const data = image.dataSync();
    for (let i = 0; i < height * width; ++i) {
      const j = i * 4;
      imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
      imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
      imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
      imageData.data[j + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.5);
  }
}

class ControllerDataset {
  constructor(numClasses) {
    this.numClasses = numClasses;
  }

  /**
   * Adds an example to the controller dataset.
   * @param {Tensor} example A tensor representing the example. It can be an image,
   *     an activation, or any other type of Tensor.
   * @param {number} label The label of the example. Should be a number.
   */
  addExample(example, label) {
    // One-hot encode the label.
    const y = tf.tidy(() => tf.oneHot(tf.tensor1d([label]).toInt(), this.numClasses));

    if (this.xs == null) {
      // For the first example that gets added, keep example and y so that the
      // ControllerDataset owns the memory of the inputs. This makes sure that
      // if addExample() is called in a tf.tidy(), these Tensors will not get
      // disposed.
      this.xs = tf.keep(example);
      this.ys = tf.keep(y);
    } else {
      const oldX = this.xs;
      this.xs = tf.keep(oldX.concat(example, 0));

      const oldY = this.ys;
      this.ys = tf.keep(oldY.concat(y, 0));

      oldX.dispose();
      oldY.dispose();
      y.dispose();
    }
  }
}