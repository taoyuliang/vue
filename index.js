let rest = {
  "result": "success",
  "data": {
    "2022-10-13": [
      {
        "gmt_exec": "2022-10-13",
        "status": "wait",
        "cnt": "1"
      }
    ],
    "2022-10-12": [
      {
        "gmt_exec": "2022-10-12",
        "status": "wait",
        "cnt": "1"
      }
    ],
    "2022-10-11": [
      {
        "gmt_exec": "2022-10-11",
        "status": "normal",
        "cnt": "2"
      },
      {
        "gmt_exec": "2022-10-11",
        "status": "wait",
        "cnt": "2"
      }
    ],
    "2022-10-06": [
      {
        "gmt_exec": "2022-10-06",
        "status": "wait",
        "cnt": "2"
      }
    ]
  }
}

// 处理统计数据
function ProcessingData (data) {
  let json = {}

  for (key in data) {
    json[key] = { "waitCount": 0, "normalCount": 0, "totalCount": 0, }

    for (let index = 0; index < data[key].length; index++) {
      const item = data[key][index];

      if (item.status == "wait") {
        json[key]['waitCount'] += 1;
      }
      else if (item.status == "normal") {
        json[key]['normalCount'] += 1;
      }

      json[key]['totalCount'] += 1
    }
  }

  return json
}

console.log('最终处理的结果：', ProcessingData(rest.data))
