"use strict";

const fs = require("fs");
const draco3d = require("draco3d");

// 创建和初始化编码模块
draco3d.createEncoderModule({}).then((encoderModule) => {
  const encoder = new encoderModule.Encoder();
  const pointCloudBuilder = new encoderModule.PointCloudBuilder();
  const pointCloud = new encoderModule.PointCloud();

  // 假设你有一个包含点云数据的数组 points
  const points = [
    [1, 2.2345678, 3.2345678],
    [4.2, 5.2345678, 300],
    [7.2345678, 3.0, 9.2345678],
  ];

  const numPoints = points.length;
  const positions = new Float32Array(numPoints * 3);

  for (let i = 0; i < numPoints; i++) {
    positions[i * 3] = points[i][0];
    positions[i * 3 + 1] = points[i][1];
    positions[i * 3 + 2] = points[i][2];
  }

  // 添加点云数据到 PointCloud 对象
  pointCloudBuilder.AddFloatAttribute(
    pointCloud,
    encoderModule.POSITION,
    numPoints,
    3,
    positions
  );

  // 设置量化级别和编码方法
  encoder.SetSpeedOptions(5, 5);
  // 量化值，值越大精度越大
  encoder.SetAttributeQuantization(encoderModule.POSITION, 30);
  encoder.SetEncodingMethod(encoderModule.MESH_SEQUENTIAL_ENCODING);

  // 编码点云数据
  const encodedData = new encoderModule.DracoInt8Array();
  const encodedLen = encoder.EncodePointCloudToDracoBuffer(
    pointCloud,
    true,
    encodedData
  );

  const outputBuffer = new ArrayBuffer(encodedLen);
  const outputData = new Int8Array(outputBuffer);
  for (let i = 0; i < encodedLen; ++i) {
    outputData[i] = encodedData.GetValue(i);
  }

  fs.writeFile("", Buffer.from(outputBuffer), "binary", function (err) {
    if (err) {
      console.log("err", err);
    } else {
      console.log("The file was saved!", encodedLen);
    }
  });
});
