# 更新所有脚本中的路径引用
# 从 qclaw-agent-framework 改为 long-running-agent-framework

# 需要更新的文件列表:
# 1. scripts/task-manager.js - FRAMEWORK_DIR
# 2. scripts/agent-loop.js - FRAMEWORK_DIR
# 3. scripts/task-interactive.js - FRAMEWORK_DIR
# 4. scripts/task-generator.js - FRAMEWORK_DIR
# 5. scripts/init-project.js - FRAMEWORK_DIR
# 6. scripts/agent_loop.py - FRAMEWORK_DIR
# 7. scripts/cron_task_runner.py - FRAMEWORK_DIR
# 8. scripts/init_project.py - FRAMEWORK_DIR
# 9. README.md - 所有路径引用
# 10. USAGE.md - 所有路径引用
# 11. USAGE_IMPROVED.md - 所有路径引用
# 12. INFINITE_RUN.md - 所有路径引用
# 13. SUMMARY.md - 所有路径引用
# 14. config.json - 已完成

# 手动重命名文件夹后，运行以下命令更新所有文件:

# PowerShell 命令:
# Get-ChildItem -Path "E:\code\long-running-agent-framework" -Recurse -File -Include "*.js","*.py","*.md" | ForEach-Object {
#     (Get-Content $_.FullName) -replace 'qclaw-agent-framework', 'long-running-agent-framework' | Set-Content $_.FullName
# }

Write-Host "请按以下步骤操作:"
Write-Host "1. 关闭所有使用 E:\code\qclaw-agent-framework 的程序"
Write-Host "2. 手动重命名文件夹: qclaw-agent-framework -> long-running-agent-framework"
Write-Host "3. 运行此脚本更新所有文件中的路径引用"
