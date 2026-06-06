# AI DevOS Docker Deployment / AI DevOS Docker 部署说明

## Overview / 概览

AI DevOS can be deployed as a Docker container with persistent SQLite storage mounted from the host machine.

AI DevOS 可以封装为 Docker 容器部署，并通过宿主机挂载目录持久化 SQLite 数据。

Default container design:

```text
Host port 3121
  -> Docker container port 3000
  -> Next.js standalone server
  -> Prisma
  -> /app/data/ai-devos.db
```

默认容器结构：

```text
宿主机端口 3121
  -> 容器端口 3000
  -> Next.js standalone server
  -> Prisma
  -> /app/data/ai-devos.db
```

## Files / 文件

| File | Purpose |
|---|---|
| `Dockerfile` | Builds the production Next.js standalone image |
| `docker-compose.yml` | Runs AI DevOS with persistent local data |
| `.dockerignore` | Keeps the Docker build context small |
| `.env.docker.example` | Example production container environment |

## Local Build / 本地构建

```bash
docker build -t ai-devos:1.1.0 .
```

Or:

```bash
npm run docker:build
```

## Run With Docker Compose / 使用 Docker Compose 运行

```bash
docker compose up -d --build
```

Or:

```bash
npm run docker:up
```

Open:

```text
http://SERVER_IP:3121
```

查看日志：

```bash
docker compose logs -f ai-devos
```

停止服务：

```bash
docker compose down
```

## Persistent Data / 数据持久化

The compose file mounts:

```text
./docker-data:/app/data
```

SQLite database path inside the container:

```text
/app/data/ai-devos.db
```

宿主机上的数据目录：

```text
./docker-data
```

Do not delete this directory unless you intentionally want to reset AI DevOS data.

不要删除该目录，除非你明确要重置 AI DevOS 数据。

### Host Directory Permissions / 宿主机目录权限

The container runs as a non-root user. If you use the bind mount in `docker-compose.yml`, make sure the host data directory is writable by the container user.

容器使用非 root 用户运行。如果使用 `docker-compose.yml` 中的宿主机挂载目录，需要确保容器用户可以写入数据目录。

Before first start:

```bash
mkdir -p docker-data
sudo chown -R 1001:1001 docker-data
```

If `/api/projects` returns HTTP 500 and logs contain `Unable to open the database file`, fix permissions and restart:

```bash
sudo chown -R 1001:1001 docker-data
docker compose restart ai-devos
```

## Environment Variables / 环境变量

Default:

```env
DATABASE_URL=file:/app/data/ai-devos.db
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

## Server Deployment / 服务器部署

Recommended path:

```text
/srv/apps/ai-devos
```

Steps:

```bash
mkdir -p /srv/apps
cd /srv/apps
git clone https://github.com/YX-NAS/ai-devos.git
cd ai-devos
docker compose up -d --build
```

If the repository is private, upload the source package or configure GitHub access first.

如果仓库是私有仓库，需要先配置 GitHub 权限，或直接上传源码包到服务器。

## Nginx Reverse Proxy / Nginx 反向代理

Example:

```nginx
server {
    listen 80;
    server_name ai-devos.example.com;

    location / {
        proxy_pass http://127.0.0.1:3121;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Health Check / 健康检查

The compose healthcheck calls:

```text
GET /api/projects
```

Manual check:

```bash
curl http://127.0.0.1:3121/api/projects
```

## Backup / 备份

Backup the SQLite database:

```bash
mkdir -p /srv/backups/ai-devos
cp /srv/apps/ai-devos/docker-data/ai-devos.db \
  /srv/backups/ai-devos/ai-devos-$(date +%F-%H%M%S).db
```

Recommended cron:

```cron
0 3 * * * cp /srv/apps/ai-devos/docker-data/ai-devos.db /srv/backups/ai-devos/ai-devos-$(date +\%F-\%H\%M\%S).db
```

## Update / 更新

```bash
cd /srv/apps/ai-devos
git pull
docker compose up -d --build
```

## Cleanup / 清理

Remove unused build cache:

```bash
docker builder prune
```

Remove unused images:

```bash
docker image prune
```

Do not run `docker compose down -v` unless you want to delete persistent database volumes.

不要执行 `docker compose down -v`，除非你明确要删除持久化数据。
