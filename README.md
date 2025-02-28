# vscode-ts-class-sketch

## 链接

- [github仓库](https://github.com/lsby/vscode-ts-class-sketch)
- [vscode商店](https://marketplace.visualstudio.com/items?itemName=hbybyyang.lsby-vscode-ts-class-sketch)

## 概述

vscode-ts-class-sketch 是一个用于快速生成 TypeScript 类速写的 VSCode 插件。它能够快速提取并复制类的属性和方法签名，排除方法的实现部分。特别适用于 AI 编程、代码文档或与团队共享类结构时，避免发送冗长的实现细节。

## 功能

- 提取 TypeScript 类的所有属性和方法签名。
- 支持提取类的修饰符（`public`、`private`、`protected`、`static` 等）。
- 排除方法实现，仅复制类型和签名。
- 快速将类结构复制到剪贴板，方便与他人共享或供 AI 使用。

## 使用方法

1. 打开你想要提取类速写的 TypeScript 文件。
2. 将光标放在类定义的行上。
3. 按下快速修复键（默认为 `Ctrl+.`）。
4. 插件将自动提取类的属性和方法签名，并将它们格式化后复制到剪贴板。
5. 你可以将这些信息粘贴到任何地方，或者发送给 AI 辅助开发工具。

## 示例

假设你有以下类定义：

```typescript
class 学生 {
  public 姓名: string
  public 年龄: number
  private 学号: string
  static 学校名称: string = '示例学校'

  constructor(姓名: string, 年龄: number, 学号: string) {
    this.姓名 = 姓名
    this.年龄 = 年龄
    this.学号 = 学号
  }

  public 获取基本信息(): string {
    return `姓名: ${this.姓名}, 年龄: ${this.年龄}`
  }

  private 获取学号(): string {
    return this.学号
  }

  static 获取学校名称(): string {
    return 学生.学校名称
  }
}
```

插件生成的类速写将是：

```typescript
class 学生 {
  constructor(姓名: string, 年龄: number, 学号: string)
  public 姓名: string
  public 年龄: number
  private 学号: string
  static 学校名称: string
  public 获取基本信息(): string
  private 获取学号(): string
  static 获取学校名称(): string
}
```
