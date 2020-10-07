1. 即插即用
    2. routing by prefix ，e.g. "/admin",

集中的配置文件， 包括　默认的配置，　

可以定制化　，
接口是给定的，包括（文件位置约定，

模块之间相互调用，采用接口调用

模块底层服务是固化的，如数据存储接口

底层服务
　　日志服务
　　数据库服务
　　数据库链接等env　配置
   Auth server
   WEBApp安全,
   server version control info
   data return interface: (for additional handle with module result value)
   
error handling
    module has internal error handling
    global error handling

document
    module need document for 'config, function describe, interface 
    model schema 
        base + extend,or sub model

each module is isolate
    access each by env config   

micro service
   e.g. 
   file server (multi server)
   OAuth Server

　　