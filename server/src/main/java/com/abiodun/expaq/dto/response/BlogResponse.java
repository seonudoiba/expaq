package com.abiodun.expaq.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BlogResponse {

    private boolean status;
    private String message;
    private Object data;
    
}
