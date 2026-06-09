# AI DevOS 操作手册 / User Guide v2

> 适用版本：1.3.0  
> 线上地址：`https://codex.5176nas.site`  
> 最新发布：v1.3.0

## 1. 登录 / Login

打开 `https://codex.5176nas.site`，浏览器会自动跳转到登录页。

输入管理员密码，点击 **Sign in**。默认密码为部署时设置的 `AI_DEVOS_ADMIN_PASSWORD` 环境变量值。

登录成功后，会话保持 7 天。

## 2. Dashboard 总控台

登录后的首页。从上到下：

| 区域 | 说明 |
|---|---|
| 统计卡片 | 项目总数、Ready for Codex 数量、进行中、阻塞数 |
| 任务状态图表 | 柱状图显示各状态任务数量；饼图显示占比分布 |
| 核心项目列表 | 显示优先级最高的 4 个项目，点击进入项目详情 |
| 最近任务 | 最新更新的 6 个任务，显示状态和项目归属 |

## 3. 项目 / Projects

### 查看项目列表
点击侧边栏 **Projects**，看到所有项目卡片。

### 创建项目
点击右上角 **New Project** 按钮，填写名称（Name）、唯一标识（slug）、描述、仓库地址、分类、优先级等信息。

### 项目详情
点击项目卡片进入详情页，可以看到：

- **当前目标 / 下一步动作** — 项目级别的上下文
- **Agent Binding** — 该项目绑定的 ChatGPT/Codex 配置
- **Requirements** — 项目需求列表
- **Tasks** — 项目下所有任务，展开可以看到 ChatGPT Handoff 内容和 Codex Prompt
- **ChatGPT Handoff 折叠区** — 展示该任务的规划摘要、实现步骤、省额度说明

## 4. 任务看板 / Tasks Kanban

### 拖拽操作
点击侧边栏 **Tasks** 进入看板。看板有 8 列：

```
TODO → RESEARCH → DESIGN → READY_FOR_CODEX → IN_PROGRESS → REVIEW → DONE
                                                       ↓
                                                    BLOCKED
```

操作方式：
1. **拖动任务卡片** 到目标列，自动更新任务状态
2. 拖动时原卡片变半透明，跟随鼠标的是浮层副本
3. 鼠标需移动 5px 后才触发拖拽（防止误触）

### 进入任务详情
点击任务卡片标题，跳转到任务详情页。

## 5. 任务详情 / Task Detail

路径：`/tasks/[id]`

| 区域 | 说明 |
|---|---|
| 标题区 | 任务标题、描述、状态和优先级徽章 |
| 状态切换 | 右上角下拉框 + Update 按钮，直接改任务状态 |
| 目标/范围 | 任务的目标和范围描述 |
| ChatGPT Handoff | 规划摘要、实现步骤、省额度说明 |
| Codex Prompt | **完整生成的 Codex 执行 Prompt** + **Copy Prompt 一键复制按钮** |
| 执行结果 | 编辑表单：执行结果摘要、Commit SHA、PR URL、部署 URL |
| Edit Handoff Fields | 折叠区，可编辑目标、范围、规划摘要、实现步骤等 |
| 相关文件 / 验收标准 | 只读展示 |
| 执行标记 | 需要 commit / push / 部署 的标签 |
| Reviews | 关联的 Review 记录 |

### Copy Prompt 操作
1. 在 Codex Prompt 区域点击 **Copy Prompt** 按钮
2. 按钮变绿显示 "Copied"，2 秒后恢复
3. 粘贴到 Codex 对话窗口即可执行

### 编辑执行结果
1. 在 **执行结果** 区域的表单中填写 Codex 执行后的信息
2. 点击 **Save Changes** 保存
3. 折叠区 **Edit Handoff Fields** 可修改规划内容

## 6. Prompts 提示词中心

路径：`/prompts`

保存可复用的 GPT 规划提示词和 Codex 执行提示词模板。每个 Prompt 可以关联到项目。

## 7. Agents 智能体

路径：`/agents`

查看当前系统中配置的所有 Agent 角色（GPT / Codex / Human / System），以及各 Agent 的默认策略和项目绑定情况。

## 8. Workflows 工作流

路径：`/workflows`

查看所有项目的工作流事件时间线，展示阶段流转历史（如 IDEA → RESEARCH → READY_FOR_CODEX → IN_CODEX → DONE）。

## 9. Deployments 部署记录

路径：`/deployments`

- 查看所有项目的生产部署历史
- 每条记录包含：环境、版本、状态、URL、Commit SHA、关联任务
- 点击任务链接可跳转到对应任务详情

### 创建部署记录
通过 API 创建（见第 11 节），或在项目详情页通过代码集成自动记录。

## 10. Settings 配置

路径：`/settings`

### 创建 Agent Profile
1. 在 **ChatGPT Profiles** 或 **Codex Profiles** 区域点击 **Add Profile**
2. 填写：
   - **Name** — 配置文件名称，如 "Default ChatGPT Planning"
   - **Provider** — ChatGPT / Codex / OpenAI API / Local
   - **Role** — GPT / Codex
   - **Model** — 模型名称，如 "ChatGPT" / "gpt-5"
   - **API Key Reference** — 仅填写引用名（如 `OPENAI_API_KEY`），不填真实密钥
   - **Strategy** — 该 Agent 的执行策略说明
   - **Set as default** — 是否设为默认配置
3. 点击 **Create**

### 编辑 Agent Profile
1. 在 Profile 卡片上点击 **Edit** 按钮
2. 弹出 modal 表单，修改后点击 **Save**

> **安全说明**：API Key 不保存在数据库中，`apiKeyRef` 仅存引用名。真实 Key 通过服务器 `.env` 或 secret 文件注入。

## 11. ChatGPT → Codex 协作流程（省额度）

### 完整四步工作流

```
第1步：ChatGPT 规划 → 第2步：创建任务 → 第3步：Codex 执行 → 第4步：验收
```

### 第1步：让 ChatGPT 做规划

在 ChatGPT 中使用以下 Prompt 模板：

```text
请作为 AI DevOS 的 ChatGPT 规划助手，先不要写代码。
请基于以下目标输出可交给 Codex 的低额度执行包：

目标：【填写目标】
范围：【填写范围】
已有上下文：【填写已有上下文】

请输出：
1. ChatGPT 规划摘要
2. 建议实现步骤
3. 相关文件
4. 验收标准
5. Codex 省额度说明：哪些文件优先看，哪些方向不要重新探索，遇到缺口时如何最短反馈
```

### 第2步：在 AI DevOS 创建任务

1. 进入项目详情页（Projects → 点击项目）
2. 在 **Codex Task Template** 表单中填写：
   - **任务标题** — 简洁的任务名称
   - **目标** — 来自 ChatGPT 的输出
   - **范围** — 来自 ChatGPT 的输出
   - **ChatGPT 规划摘要** — 粘贴 ChatGPT 输出的第1项
   - **建议实现步骤** — 粘贴 ChatGPT 输出的第2项
   - **Codex 省额度说明** — 粘贴 ChatGPT 输出的第5项
   - **相关文件** — 粘贴 ChatGPT 输出的第3项
   - **验收标准** — 粘贴 ChatGPT 输出的第4项
3. 勾选需要 commit / push / 部署的标记
4. 点击 **Create Codex Task**

> 系统会自动根据这些字段生成 Codex Prompt。

### 第3步：交给 Codex 执行

1. 进入刚创建的任务详情页（Tasks 看板中点击卡片标题）
2. 在 **Codex Prompt** 区域点击 **Copy Prompt**
3. 打开 Codex 对话窗口，粘贴 Prompt
4. Codex 执行完毕后，回到任务详情页

### 第4步：记录结果和验收

1. 在 **执行结果** 区域填写：
   - 执行结果摘要
   - Commit SHA
   - PR URL
   - 部署 URL
2. 点击 **Save Changes**
3. 将任务状态改为 REVIEW 或 DONE

## 12. API 参考

所有 API 路径均挂载在 `https://codex.5176nas.site/api/` 下，需要携带登录 Cookie。

### 常用 API

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/login` | 登录，传 `{"password":"..."}` |
| POST | `/api/auth/logout` | 登出 |
| GET | `/api/projects` | 获取项目列表 |
| GET | `/api/projects/[id]` | 获取项目详情 |
| GET | `/api/tasks` | 获取所有任务 |
| GET | `/api/tasks/[id]` | 获取任务详情 |
| PATCH | `/api/tasks/[id]` | 更新任务字段 |
| PATCH | `/api/tasks/[id]/status` | 更新任务状态 `{"status":"IN_PROGRESS"}` |
| GET | `/api/deployments` | 获取部署记录 |
| POST | `/api/projects/[id]/deployments` | 创建部署记录 |
| GET/PATCH | `/api/agent-configs/[id]` | 获取/更新 Agent 配置 |

### 示例：通过 curl 操作

```bash
# 登录并保存 cookie
curl -X POST https://codex.5176nas.site/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password"}' -c cookie.txt

# 获取任务列表
curl -b cookie.txt https://codex.5176nas.site/api/tasks

# 更新任务状态
curl -X PATCH https://codex.5176nas.site/api/tasks/TASK_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"REVIEW"}' -b cookie.txt
```

## 13. 部署运维 / Operations

### 服务器信息
- 主机：新加坡 2C4G（43.156.94.64）
- 域名：`codex.5176nas.site`
- 路径：`/srv/apps/ai-devos`
- 容器名：`ai-devos`
- 端口映射：`3121:3000`

### 更新部署

```bash
ssh root@43.156.94.64
cd /srv/apps/ai-devos
git pull origin codex/ai-devos-1.2
docker-compose down
AI_DEVOS_ADMIN_PASSWORD=your-password docker-compose up -d --build
```

### 查看容器状态

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker logs -f ai-devos --tail 50
```

### 备份数据库

```bash
cp /srv/apps/ai-devos/docker-data/ai-devos.db \
   /srv/apps/ai-devos/docker-data/ai-devos.db.$(date +%Y%m%d-%H%M).bak
```

### 数据恢复

```bash
docker-compose down
cp docker-data/ai-devos.db.YYYYMMDD-HHMM.bak docker-data/ai-devos.db
docker-compose up -d
```

---

## 快捷导航

| 你想做什么 | 去哪 |
|---|---|
| 看项目全貌 | Dashboard `/` |
| 拖拽管理任务 | Tasks `/tasks` |
| 新建任务给 Codex | 项目详情 → Codex Task Template |
| 复制 Codex Prompt | 任务详情 → Copy Prompt 按钮 |
| 记录执行结果 | 任务详情 → 执行结果区域 → Save |
| 配置 ChatGPT/Codex Profile | Settings `/settings` → Add Profile |
| 查看部署历史 | Deployments `/deployments` |
| 修改管理员密码 | 服务器 `.env` 中改 `AI_DEVOS_ADMIN_PASSWORD` 后重建容器 |
