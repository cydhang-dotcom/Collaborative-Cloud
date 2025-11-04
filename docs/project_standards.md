# 项目标准

## 1. 引言

本文档概述了班步协作平台前端的开发标准和最佳实践。遵守这些标准可以确保代码的一致性、可维护性和高质量。

## 2. 编码风格

-   **语言**: 所有新代码均使用 TypeScript，以确保类型安全。
-   **Linter/Formatter**: 使用预配置的 linter (如 ESLint) 和 formatter (如 Prettier) 来保持统一的代码风格。
-   **React**:
    -   使用函数式组件和 Hooks。
    -   组件名称应为 `PascalCase`。
    -   Hook 和变量名称应为 `camelCase`。
-   **文件命名**: 组件文件应命名为 `PascalCase` (例如, `MyComponent.tsx`)。工具类文件应为 `camelCase` (例如, `utils.ts`)。

## 3. 组件架构

-   **原子化设计**: 组件应被拆分为最小的合理单元。尽可能创建可复用的通用组件 (例如, `Button`, `Icon`, `Modal`)。
-   **无状态 vs. 有状态**: 优先使用无状态函数式组件。状态应在逻辑上最高的层级进行管理，并通过 props 向下传递。
-   **Props**: 使用 TypeScript 接口为每个组件定义 props，以确保清晰度和类型安全。

## 4. 状态管理

-   **本地状态**: 对于不影响应用其他部分的组件特定状态，使用 `useState` 和 `useReducer` hooks。
-   **全局状态**: 对于需要在整个应用中共享的状态 (例如, 用户认证、主题)，使用 React 的 Context API。对于更复杂的场景，未来可以考虑使用专门的状态管理库。

## 5. UI/UX 标准

### 5.1 颜色

-   **主色调 (Primary)**: Teal (泰尔绿), 用于可交互元素、按钮、链接和高亮显示。 (e.g., `teal-500`)
-   **背景色 (Background)**:
    -   页面主背景: `gray-50`
    -   卡片/容器背景: `white`
-   **文本色 (Text)**:
    -   主要文本: `gray-800`, `gray-900`
    -   次要文本/标签: `gray-500`, `gray-600`
-   **边框色 (Border)**: `gray-200`
-   **强调色 (Accent)**:
    -   危险/错误: Red (e.g., `red-500`, `red-600`)
    -   通知/状态: Red (e.g., `bg-red-500` for badges)
    -   成功/正常: Green (e.g., `green-800` for status tags)

### 5.2 字体排版

-   **字体族**: 无衬线字体 (Sans-serif)，使用系统默认字体。
-   **字重**:
    -   常规: `font-normal`
    -   中等: `font-medium`
    -   加粗: `font-bold`
-   **字号**:
    -   页面主标题 (H2): `text-3xl`
    -   卡片标题 (H3): `text-xl`
    -   正文/表格内容: `text-sm`
    -   标签/次要信息: `text-xs`

### 5.3 布局与间距

-   **基础布局**: 页面内容应包裹在统一的卡片式容器中 (`bg-white p-8 rounded-xl shadow-md`)。
-   **间距**: 遵循 Tailwind CSS 的 4px 基线网格系统 (e.g., `p-4`, `m-6`, `space-x-4`)，以确保视觉节奏一致。
-   **响应式设计**: 所有组件和布局都必须是响应式的，并在常见的屏幕尺寸上进行测试。

### 5.4 组件风格

-   **按钮 (Buttons)**:
    -   主要按钮: `bg-teal-500 text-white`，带有 `hover` 效果和阴影。
    -   次要按钮: `border border-gray-300 text-gray-700`，带有 `hover:bg-gray-50` 效果。
    -   危险按钮: `text-red-600`，带有 `hover:bg-red-50` 效果。
-   **输入框 (Inputs)**: 带有 `border` 和 `rounded` 样式，在 `focus` 状态下有 `ring` 或边框高亮。
-   **弹窗 (Modals)**: 居中显示，带有半透明背景遮罩。内容区域为白色圆角卡片。
-   **表格 (Tables)**: 表头使用 `bg-gray-50`，行之间有 `border-b` 分隔，行在 `hover` 时有背景色变化。

### 5.5 图标 (Iconography)

-   **风格**: 线条风格 (Outline)。
-   **粗细**: `stroke-width: 2`。
-   **尺寸**: 根据上下文使用标准尺寸，如 `w-4 h-4`, `w-5 h-5`, `w-6 h-6`。

## 6. 可访问性 (A11y)

-   **语义化 HTML**: 使用语义化的 HTML5 元素 (`<nav>`, `<main>`, `<header>` 等) 来正确构建应用结构。
-   **ARIA 角色**: 在必要时使用 ARIA (Accessible Rich Internet Applications) 角色和属性，为屏幕阅读器提供上下文，特别是对于复杂的交互式组件，如弹窗和自定义下拉菜单。
-   **键盘导航**: 确保所有交互元素都可以仅通过键盘访问和操作。
-   **焦点管理**: 合理管理焦点，尤其是在弹窗和弹出层中。当弹窗打开时，焦点应移入其中。当它关闭时，焦点应返回到触发它的元素上。