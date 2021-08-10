const t = {
  code: 200,
  msg: "ok",
  timeStamp: 1234567890123,
  data: {
    processing: [
      {
        id: 123456, //'主键id',
        prdName: "StartPad", //项目名称、代表全称,
        currency: "STP", //需要购买的代币名称',
        baseCurrency: "STP", //用户质押币种名称',
        rate: "0.0001", //兑换率',
        pledgeTotal: 12000000.5, //总质押量',
        raiseTotal: 1000000.5, //'筹集总量',
        currencyTotal: 15000000.5, //'代币预发行总量',
        attribute: ["属性1", "属性2"], // '项目属性',
        address: "0x00000000231231230111", //'公链地址',
        label: ["标签1", "标签2", "标签N"], //'标签',
        links: [
          {
            name: "facebook",
            url: "http://。。。。。。...jpeg",
          },
        ], //快捷链接
        icon: "http://dfadafafaf.jpeg", //'图标',
        state: "init", //'项目状态：init，processing，finish',
        prdDesc: "项目描述", // '项目描述',
        ruleDesc: "规则描述", // '规则描述',
        createTime: 1628160539076, //'创建时间',
        updateTime: 1628160539076, // '更新时间',
        pledgeStartTime: 1628160539076, //'项目开始时间', 质押开始时间
        pledgeEndTime: 111111111111, //'质押结束时间', 锁仓开始时间
        lockStartTime: 111111111111, // '锁仓开始时间'
        lockEndTime: 1628160539076, //'锁仓结束时间',
        endTime: 1628160539076, // '项目结束时间',
        payTime: 1628160539076, //'支付时间',
        assignmentTime: 111111111111, // '代币分配时间',
      },
      {
        id: 123456, //'主键id',
        prdName: "StartPad", //项目名称、代表全称,
        currency: "STP", //需要购买的代币名称',
        baseCurrency: "STP", //用户质押币种名称',
        rate: "0.0001", //兑换率',
        baseTotal: 12000000.5, //总质押量',
        raiseTotal: 1000000.5, //'筹集总量',
        currencyTotal: 15000000.5, //'代币预发行总量',
        attribute: ["属性1", "属性2"], // '项目属性',
        address: "0x00000000231231230111", //'公链地址',
        label: ["标签1", "标签2", "标签N"], //'标签',
        links: [
          {
            name: "facebook",
            url: "http://。。。。。。...jpeg",
          },
        ], //快捷链接
        icon: "http://dfadafafaf.jpeg", //'图标',
        state: "init", //'项目状态：init，processing，finish',
        prdDesc: "项目描述", // '项目描述',
        ruleDesc: "规则描述", // '规则描述',
        createTime: 1628160539076, //'创建时间',
        updateTime: 1628160539076, // '更新时间',
        startTime: 1628160539076, //'项目开始时间',
        pledgeEndTime: 111111111111, //'质押结束时间',
        lockEndTime: 1628160539076, //'锁仓结束时间',
        endTime: 1628160539076, // '项目结束时间',
        payTime: 1628160539076, //'支付时间',
        assignmentTime: 111111111111, // '代币分配时间',
      },
    ],
    closed: [],
  },
};

export default t;
