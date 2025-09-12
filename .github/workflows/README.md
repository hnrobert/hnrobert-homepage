# GitHub Actions 工作流说明

本项目包含两个主要的 GitHub Actions 工作流，用于不同的部署场景。

## 工作流概览

### 1. `docker-build-and-push.yml` - 持续集成构建

**用途**: 日常开发的持续集成，在代码变更时自动构建 Docker 镜像

**触发条件**:

- 推送到 `main` 或 `develop` 分支（且源码有变更）
- 创建 Pull Request 到 `main` 分支
- 手动触发

**特性**:

- ✅ 智能变更检测 - 只在源码变更时构建
- ✅ 多架构构建 (amd64, arm64)
- ✅ PR 构建验证（仅构建不推送）
- ✅ 构建缓存优化
- ✅ 自动标签管理

**监控的文件**:

- `src/**` - 源代码目录
- `package.json` - 依赖配置
- `pnpm-lock.yaml` - 锁定文件
- `next.config.js` - Next.js 配置
- `Dockerfile` - Docker 构建文件
- `docker-compose*.yml` - Docker Compose 配置

### 2. `release.yml` - 版本发布

**用途**: 正式版本发布，创建 Release 和完整的部署资源

**触发条件**:

- 创建 GitHub Release
- 手动触发（可指定版本号）

**特性**:

- 🚀 自动创建 GitHub Release
- 📦 生成完整的部署文件包
- 🐳 发布多标签 Docker 镜像
- 📋 包含 Kubernetes 部署清单
- 🛠️ 提供一键部署脚本

## 使用场景

### 开发阶段

```bash
# 推送代码到 develop 分支
git push origin develop
# → 触发 docker-build-and-push.yml
# → 构建 develop 标签的镜像
```

### 版本发布

```bash
# 方式1: 创建 GitHub Release
# 在 GitHub 界面创建 Release，自动触发构建

# 方式2: 手动触发
# 在 GitHub Actions 页面手动运行 release.yml
# 输入版本号如 v1.0.0
```

## 镜像标签规则

### 开发构建标签

- `latest` - main 分支最新构建
- `main` - main 分支构建
- `develop` - develop 分支构建
- `main-abc1234` - 带提交 SHA 的标签

### 发布构建标签

- `v1.0.0` - 完整版本号
- `1.0.0` - 不带 v 前缀的版本号
- `1.0` - 主要.次要版本
- `1` - 主要版本
- `latest` - 最新发布版本

## 快速部署

### 使用最新开发版本

```bash
docker pull ghcr.io/hnrobert/hnrobert-homepage:latest
docker run -d -p 9970:3000 ghcr.io/hnrobert/hnrobert-homepage:latest
```

## 工作流状态监控

可以在以下位置查看工作流状态：

- [Actions 页面](../../actions)
- [Packages 页面](../../packages) - 查看 Docker 镜像
- [Releases 页面](../../releases) - 查看发布版本

## 故障排除

### 构建失败

1. 检查 Actions 日志
2. 确认源码变更是否符合触发条件
3. 验证 Dockerfile 语法

### 镜像推送失败

1. 检查 GitHub Token 权限
2. 确认包权限设置
3. 验证镜像标签格式

### 部署失败

1. 检查容器日志: `docker logs <container_name>`
2. 验证端口映射和环境变量
3. 确认依赖服务是否正常
