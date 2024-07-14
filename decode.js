"use strict";

const fs = require("fs");
const draco3d = require("draco3d");

// 创建和初始化解码模块
draco3d.createDecoderModule({}).then((decoderModule) => {
  const decoder = new decoderModule.Decoder();

  // 读取压缩的 .drc 文件
  const encodedData = fs.readFileSync("");
  const buffer = new decoderModule.DecoderBuffer();
  buffer.Init(new Int8Array(encodedData), encodedData.length);

  // 解码点云数据
  const pointCloud = new decoderModule.PointCloud();
  const status = decoder.DecodeBufferToPointCloud(buffer, pointCloud);

  if (!status.ok() || pointCloud.ptr === 0) {
    console.error("Decoding failed:", status.error_msg());
    return;
  }

  // 获取点云数据
  const numPoints = pointCloud.num_points();
  const positionAttribute = decoder.GetAttribute(
    pointCloud,
    decoderModule.POSITION
  );
  const numComponents = positionAttribute.num_components();
  // const positions = new Float32Array(numPoints * numComponents);

  const attributeData = new decoderModule.DracoFloat32Array();

  decoder.GetAttributeFloatForAllPoints(
    pointCloud,
    positionAttribute,
    attributeData
  );

  const attributeDataArray = new Float32Array(numPoints * numComponents);
  for (let i = 0; i < numPoints * numComponents; ++i) {
    attributeDataArray[i] = attributeData.GetValue(i);
  }

  console.log(attributeDataArray);

  // 释放资源
  decoderModule.destroy(pointCloud);
  decoderModule.destroy(buffer);
  decoderModule.destroy(decoder);
});
