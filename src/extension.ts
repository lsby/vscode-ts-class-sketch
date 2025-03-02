import { Project, ts } from 'ts-morph'
import * as vscode from 'vscode'

let 插件名称 = 'lsby-vscode-ts-class-sketch'

export class 自定义代码动作提供程序 implements vscode.CodeActionProvider {
  private 匹配类名(输入字符串: string): string | null {
    // 第一步：用正则匹配类定义部分
    let 初步匹配 = 输入字符串.match(/class\s+(\S+)/)
    if (!初步匹配) return null

    // 第二步：提取类名，只考虑空格前的部分
    let 类名部分 = 初步匹配[1]
    let 真实类名 = 类名部分?.split(' ')[0]?.split('<')[0]?.trim()

    return 真实类名 || null
  }

  public provideCodeActions(
    文档: vscode.TextDocument,
    范围: vscode.Range,
    _上下文: vscode.CodeActionContext,
    _取消标记: vscode.CancellationToken,
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    let 代码动作: vscode.CodeAction[] = []

    let 编辑器 = vscode.window.activeTextEditor
    let 文件路径 = 编辑器?.document.uri.fsPath
    if (!文件路径) return 代码动作

    let 起点行 = 文档.lineAt(范围.start.line).text

    let 类名 = this.匹配类名(起点行)
    if (类名) {
      let 生成类速写 = new vscode.CodeAction('生成类速写', vscode.CodeActionKind.QuickFix)
      生成类速写.command = {
        command: `${插件名称}.genClassSketch`,
        title: '生成类速写',
        arguments: [文件路径, 类名],
      }
      代码动作.push(生成类速写)
    }

    return 代码动作
  }
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(['typescript', 'typescriptreact'], new 自定义代码动作提供程序(), {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
    }),
  )

  vscode.commands.registerCommand(`${插件名称}.genClassSketch`, (文件路径: string, 类名: string) => {
    let 项目 = new Project()
    let 文件 = 项目.addSourceFileAtPath(文件路径)

    let 类定义 = 文件.getClass(类名)
    if (!类定义) {
      vscode.window.showErrorMessage(`没有找到类 ${类名}`)
      return
    }

    let 构造函数签名 = 类定义
      .getConstructors()
      .map((构造函数) => {
        let 参数 = 构造函数
          .getParameters()
          .map((参数) => {
            return `${参数.getName()}: ${参数.getType().getText(undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)}`
          })
          .join(', ')

        return `constructor(${参数})`
      })
      .join('\n')

    let 属性签名 = 类定义
      .getProperties()
      .map((属性) => {
        let 修饰符 = 属性
          .getModifiers()
          .map((mod) => mod.getText())
          .join(' ')
        let 属性名称 = 属性.getName()
        let 属性类型 = 属性
          .getType()
          .getText(undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
        return `${修饰符} ${属性名称}: ${属性类型};`
      })
      .join('\n')

    let 方法签名 = 类定义
      .getMethods()
      .map((方法) => {
        let 修饰符 = 方法
          .getModifiers()
          .map((mod) => mod.getText())
          .join(' ')
        let 方法名称 = 方法.getName()
        let 方法返回类型 = 方法
          .getReturnType()
          .getText(undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)
        let 方法参数 = 方法
          .getParameters()
          .map((参数) => {
            return `${参数.getName()}: ${参数.getType().getText(undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)}`
          })
          .join(', ')

        return `${修饰符} ${方法名称}(${方法参数}): ${方法返回类型};`
      })
      .join('\n')

    let 类速写 = [
      `class ${类名} {`,
      构造函数签名
        .split('\n')
        .map((构造函数) => `  ${构造函数}`)
        .join('\n'),
      属性签名
        .split('\n')
        .map((属性) => `  ${属性}`)
        .join('\n'),
      方法签名
        .split('\n')
        .map((方法) => `  ${方法}`)
        .join('\n'),
      `}`,
    ].join('\n')

    vscode.env.clipboard.writeText(类速写).then(() => {
      vscode.window.showInformationMessage(`已将类 ${类名} 的速写复制到剪贴板`)
    })
  })
}
