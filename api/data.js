import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join('/tmp', 'school-data.json');

// 初始化数据文件
function initData() {
  if (!fs.existsSync(DATA_PATH)) {
    const defaultData = {
      classes: [
        {
          id: 1,
          name: "计算机1班",
          students: [
            {
              id: "001",
              name: "测试学生",
              identity: "学生",
              dailyRecords: {},
              monthlyTotalRecords: {}
            }
          ]
        }
      ]
    };
    fs.writeFileSync(DATA_PATH, JSON.stringify(defaultData, null, 2));
  }
}

// 读取数据
export function readData() {
  initData();
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

// 保存数据
export function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Vercel 接口入口
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const data = readData();
      return res.json(data);
    }

    if (req.method === 'POST') {
      const body = req.body;
      writeData(body);
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}