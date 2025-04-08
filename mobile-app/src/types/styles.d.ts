declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.scss' {
  const content: { readonly [key: string]: string }
  export default content
}

declare module '*.sass' {
  const styleSheet: { readonly [key: string]: string }
  export default styleSheet
}

declare module '*.less' {
  const moduleClasses: { readonly [key: string]: string }
  export default moduleClasses
}

declare module '*.styl' {
  const stylesheet: { readonly [key: string]: string }
  export default stylesheet
}

// 资源类型声明
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}
