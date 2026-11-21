package com.unimedconnect.video;

import com.unimedconnect.database.DatabaseManager;
import jakarta.jws.WebService;
import jakarta.xml.ws.soap.SOAPFaultException;
import jakarta.xml.soap.SOAPFactory;
import jakarta.xml.soap.SOAPFault;
import javax.xml.namespace.QName;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

@WebService(
    endpointInterface = "com.unimedconnect.video.VideoSessionService",
    serviceName = "VideoSessionService",
    portName = "VideoSessionServicePort",
    targetNamespace = "http://unimedconnect.com/video"
)
public class VideoSessionServiceImpl implements VideoSessionService {

    @Override
    public VideoSession createSession(String title, String type, String hostId, String hostName) throws Exception {
        if (title == null || title.trim().isEmpty()) {
            throw createSoapFault("Client", "Session title is required.");
        }

        String sessionId = "CONF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String sql = "INSERT INTO video_sessions (session_id, title, type, host_id, host_name, participant_count, status) VALUES (?, ?, ?, ?, ?, 1, 'ACTIVE')";

        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, sessionId);
            ps.setString(2, title);
            ps.setString(3, type != null ? type : "CLASSROOM");
            ps.setString(4, hostId != null ? hostId : "HOST-1");
            ps.setString(5, hostName != null ? hostName : "Host User");
            ps.executeUpdate();

            return new VideoSession(sessionId, title, type, hostId, hostName, 1, "ACTIVE");
        } catch (SQLException e) {
            throw createSoapFault("Server", "Failed to create video session: " + e.getMessage());
        }
    }

    @Override
    public boolean joinSession(String sessionId, String userId) throws Exception {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            throw createSoapFault("Client", "sessionId is required.");
        }

        String sql = "UPDATE video_sessions SET participant_count = participant_count + 1 WHERE session_id = ? AND status = 'ACTIVE'";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, sessionId.trim());
            int rows = ps.executeUpdate();
            if (rows > 0) {
                return true;
            } else {
                throw createSoapFault("Client", "Session not found or already ended.");
            }
        } catch (SQLException e) {
            throw createSoapFault("Server", "Database error: " + e.getMessage());
        }
    }

    @Override
    public boolean endSession(String sessionId) throws Exception {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            throw createSoapFault("Client", "sessionId is required.");
        }

        String sql = "UPDATE video_sessions SET status = 'ENDED' WHERE session_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, sessionId.trim());
            int rows = ps.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            throw createSoapFault("Server", "Database error: " + e.getMessage());
        }
    }

    @Override
    public VideoSession getSessionStatus(String sessionId) throws Exception {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            throw createSoapFault("Client", "sessionId is required.");
        }

        String sql = "SELECT session_id, title, type, host_id, host_name, participant_count, status FROM video_sessions WHERE session_id = ?";
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, sessionId.trim());
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new VideoSession(
                        rs.getString("session_id"),
                        rs.getString("title"),
                        rs.getString("type"),
                        rs.getString("host_id"),
                        rs.getString("host_name"),
                        rs.getInt("participant_count"),
                        rs.getString("status")
                    );
                } else {
                    throw createSoapFault("Client", "Video session '" + sessionId + "' not found.");
                }
            }
        } catch (SQLException e) {
            throw createSoapFault("Server", "Database error: " + e.getMessage());
        }
    }

    private SOAPFaultException createSoapFault(String faultCode, String faultString) {
        try {
            SOAPFactory sf = SOAPFactory.newInstance();
            SOAPFault fault = sf.createFault(faultString, new QName("http://schemas.xmlsoap.org/soap/envelope/", faultCode));
            return new SOAPFaultException(fault);
        } catch (Exception e) {
            throw new RuntimeException(faultString, e);
        }
    }
}
