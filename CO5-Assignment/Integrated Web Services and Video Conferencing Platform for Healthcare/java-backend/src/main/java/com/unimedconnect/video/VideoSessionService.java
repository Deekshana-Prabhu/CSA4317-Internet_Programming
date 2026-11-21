package com.unimedconnect.video;

import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebResult;
import jakarta.jws.WebService;
import jakarta.jws.soap.SOAPBinding;

@WebService(targetNamespace = "http://unimedconnect.com/video")
@SOAPBinding(style = SOAPBinding.Style.DOCUMENT, use = SOAPBinding.Use.LITERAL)
public interface VideoSessionService {

    @WebMethod(operationName = "createSession")
    @WebResult(name = "session")
    VideoSession createSession(
        @WebParam(name = "title") String title,
        @WebParam(name = "type") String type,
        @WebParam(name = "hostId") String hostId,
        @WebParam(name = "hostName") String hostName
    ) throws Exception;

    @WebMethod(operationName = "joinSession")
    @WebResult(name = "success")
    boolean joinSession(
        @WebParam(name = "sessionId") String sessionId,
        @WebParam(name = "userId") String userId
    ) throws Exception;

    @WebMethod(operationName = "endSession")
    @WebResult(name = "success")
    boolean endSession(@WebParam(name = "sessionId") String sessionId) throws Exception;

    @WebMethod(operationName = "getSessionStatus")
    @WebResult(name = "session")
    VideoSession getSessionStatus(@WebParam(name = "sessionId") String sessionId) throws Exception;
}
