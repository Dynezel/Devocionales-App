package dylan.devocionalesspring;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // `queue` para mensajes privados
        config.setApplicationDestinationPrefixes("/app"); // Cliente envía a /app/...
        config.setUserDestinationPrefix("/user"); // Para enviar a un usuario específico

    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-notifications").setAllowedOrigins("https://devocionales-app-frontend.vercel.app").withSockJS(); //En producción, reemplazar setAllowedOrigins("*") por dominios específicos.
    }
}
