######  TypeScript中装饰器



这段代码展示了 TypeScript 中 ** 装饰器（Decorators）** 的使用。装饰器是一种特殊的声明，可用于修改类、方法、属性等。我来解释一下：
1. 装饰器函数 logClass
typescript

function logClass(target: Function) {
  console.log(`Class ${target.name} is created`);
}


    作用：这是一个类装饰器，它接收一个参数 target（被装饰的类本身），并在类定义时执行一些操作（这里是打印日志）。
    执行时机：类定义时（不是实例化时），装饰器就会被调用。

2. @ 符号的含义
typescript

@logClass
class MyClass { ... }


    语法糖：@ 是 TypeScript 提供的语法糖，用于应用装饰器。
    作用：它将 logClass 函数 “附着” 到 MyClass 类上，当类被定义时，装饰器函数会立即执行。
    等价写法（不使用 @ 符号）：
    typescript

    class MyClass { ... }
    MyClass = logClass(MyClass) || MyClass; // 手动应用装饰器


3. 执行流程
typescript

@logClass
class MyClass {
  constructor() {
    console.log('MyClass instance created');
  }
}

new MyClass(); // 创建实例


    类定义时：装饰器 logClass 执行，打印 Class MyClass is created。
    实例化时：new MyClass() 调用构造函数，打印 MyClass instance created。

4. 装饰器的使用范围
装饰器可以应用于以下场景（通过不同的参数区分）：
类装饰器（如本例）

    参数：类的构造函数。
    用途：修改类的定义，例如添加静态属性、方法等。

方法装饰器
typescript

function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // 可修改方法的行为
}

class Example {
  @logMethod
  sayHello() { ... }
}

属性装饰器
typescript

function readonly(target: any, propertyKey: string) {
  // 可修改属性的特性（如设置为只读）
}

class Example {
  @readonly
  name: string = "example";
}

参数装饰器
typescript

function logParameter(target: any, propertyKey: string, parameterIndex: number) {
  // 可记录参数信息
}

class Example {
  greet(@logParameter message: string) { ... }
}

5. 装饰器的执行顺序

    多个装饰器：从上到下声明，从下到上执行。
    typescript

    @a
    @b
    class C {}
    // 执行顺序：b → a


6. 实际应用场景

    日志记录（如本例）
    依赖注入（如 Angular 的 @Component、@Injectable）
    性能监控（记录方法执行时间）
    权限校验（限制方法调用）

总结

    @ 符号：是装饰器的语法糖，用于简洁地应用装饰器函数。
    装饰器本质：是一个函数，在类、方法、属性等定义时执行，可修改其行为。
    使用注意：装饰器是实验性特性，需在 tsconfig.json 中开启 experimentalDecorators 选项。


如果需要更复杂的功能（如传递参数给装饰器），可以使用装饰器工厂，它返回一个装饰器函数。