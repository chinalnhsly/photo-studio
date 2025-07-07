// @ts-nocheck
import React from "react";
import { ConfigProvider, message } from "antd";

 
import { ApplyPluginsType } from "umi";
import { plugin } from "../core/umiExports";

export function rootContainer(container) {
  const runtimeAntd = plugin.applyPlugins({
    key: "antd",
    type: ApplyPluginsType.modify,
    initialValue: {},
  });

  const finalConfig = {...{"disableReactStrictMode":true},...runtimeAntd}

  if (finalConfig.prefixCls) {
      // 新版本的写法
      ConfigProvider.config({
        prefixCls: finalConfig.prefixCls,
      });

    message.config({
      prefixCls: `${finalConfig.prefixCls}-message`,
    });
  }
  return React.createElement(ConfigProvider, finalConfig, container);
}
