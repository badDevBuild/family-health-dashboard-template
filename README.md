# Family Health Dashboard Template

一个隐私优先、以器官系统为中心的家庭健康资料看板模板。项目把“原始报告处理流程”和“只读展示应用”分开：真实健康资料留在本地，Git 仓库只保存代码、流程规范和明确标注的虚构示例。

> 这不是医疗诊断或处方工具。所有分析只用于整理和解释资料；异常结果应由合格医生结合完整病史判断。

## 它解决什么问题

- 用健康事件保存一次体检或就医的数据，以时间线查看变化。
- 把同一指标投影到一个或多个器官系统，以身体视角阅读。
- 将提取、综合分析、建议、生活指南和独立复核拆成可审计步骤。
- 默认不提交报告、真实 JSON、头像、密钥或带真实数据的前端 bundle。
- 提供面向手机和老人的温暖、低焦虑只读界面。

## 快速体验（仅虚构数据）

```bash
npm ci
npm run generate-demo-data
npm run dev
```

静态演示默认不启用 PIN，因为仓库中只有虚构数据。运行完整门禁：

```bash
npm run check
```

## 使用自己的资料

1. 按 [数据契约](docs/DATA-CONTRACT.md) 在本地创建 `data/`；该目录已被 Git 忽略。
2. 把报告放在本地 `reports/<成员>/<年份>/`，不要复制到公开仓库。
3. 按 [处理流程](docs/PIPELINE.md) 完成提取、分析、建议、复核和批准。
4. 生成被 Git 忽略的私有前端数据模块：

   ```bash
   npm run generate-private-data
   ```

5. 构建私有版本：

   ```bash
   VITE_AUTH_ENABLED=true npm run build-private
   ```

6. 设置 `PIN_HASH`、`AUTH_SECRET` 和 `COOKIE_SECURE` 后，用可选的 FastAPI 服务托管 `dist/`。生产环境还应配置 HTTPS、访问日志脱敏、备份和网络层限流。

## 目录

```text
src/                     React 只读看板
scripts/generate-data.mjs 结构化 JSON -> 前端数据模块
scripts/privacy-check.mjs 提交前隐私门禁
examples/demo-data/       明确标注的虚构数据
.agents/skills/           可移植的五步 Agent 工作流
docs/                     架构、数据契约、隐私和设计系统
server/                   可选 PIN 鉴权静态服务器
```

## 隐私模型

这个仓库采用“数据不进 Git”的设计，而不是依赖事后删文件。演示数据和真实数据走两条输出路径：

- `src/lib/health-data.ts`：可提交，仅由 `examples/demo-data/` 生成。
- `src/lib/health-data.private.ts`：不可提交，仅由本地 `data/` 生成。

第一次发布前，建议另外创建 `privacy-denylist.local.txt`，每行放一个只在本机保存的真实姓名、机构或独特标识，再运行 `npm run privacy-check`。详见 [PRIVACY.md](docs/PRIVACY.md)。

## 技术栈

React 19、TypeScript、Vite、Tailwind CSS、Vitest；可选 FastAPI 静态服务。

## 项目状态

这是从真实项目抽取出的通用模板。仓库不包含任何真实家庭成员、健康报告、头像、部署主机或凭据。
