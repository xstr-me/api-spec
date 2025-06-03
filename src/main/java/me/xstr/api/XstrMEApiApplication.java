package me.xstr.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FullyQualifiedAnnotationBeanNameGenerator;

@SpringBootApplication(
    nameGenerator = FullyQualifiedAnnotationBeanNameGenerator.class
)
@ComponentScan(
    basePackages = {"me.xstr.api", "me.xstr.api.controller" , "me.xstr.api.configuration"},
    nameGenerator = FullyQualifiedAnnotationBeanNameGenerator.class
)
public class XstrMEApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(XstrMEApiApplication.class, args);
    }


}