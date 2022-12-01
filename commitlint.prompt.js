module.exports = {
  prompt: {
    setting: {},
    questions: {
      type: {
        description: "选择一个commit类型:",
        enum: {
          feat: {
            description: "新功能",
            title: "Features",
            emoji: "✨",
          },
          fix: {
            description: "修复bug",
            title: "Bug Fixes",
            emoji: "🐛",
          },
          docs: {
            description: "文档变化",
            title: "Documentation",
            emoji: "📚",
          },
          style: {
            description: "不会影响代码逻辑的修改",
            title: "Styles",
            emoji: "💎",
          },
          refactor: {
            description: "既不修改bug也不添加新功能的代码修改",
            title: "Code Refactoring",
            emoji: "📦",
          },
          perf: {
            description: "提升性能的修改",
            title: "Performance Improvements",
            emoji: "🚀",
          },
          test: {
            description: "添加或修改单元测试",
            title: "Tests",
            emoji: "🚨",
          },
          build: {
            description: "构建项目或新增依赖",
            title: "Builds",
            emoji: "🛠",
          },
          ci: {
            description: "修改集成文件或脚本",
            title: "Continuous Integrations",
            emoji: "⚙️",
          },
          chore: {
            description: "不修改src或测试文件的其他更改",
            title: "Chores",
            emoji: "♻️",
          },
          revert: {
            description: "恢复之前的提交",
            title: "Reverts",
            emoji: "🗑",
          },
        },
      },
      scope: {
        description: "此更改的范围是什么？(比如：组件 或 文件)",
      },
      subject: {
        description: "简短的描述修改内容",
      },
      body: {
        description: "更详细的更改说明",
      },
      isBreaking: {
        description: "是否有重大变化?",
      },
      breakingBody: {
        description: "重大变化需要提交详细说明，请描述重大变化的具体内容。",
      },
      breaking: {
        description: "描述重大变化",
      },
      isIssueAffected: {
        description: "该变化是否会影响到issue?",
      },
      issuesBody: {
        description: "请详细描述对这个issue的影响。",
      },
      issues: {
        description: '影响到的issue引用 (比如 "fix #123", "re #123".)',
      },
    },
  },
};
