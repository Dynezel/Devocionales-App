package dylan.devocionalesspring.servicios;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class UsuarioDetalles extends User {

    private Long idCodigoTributario;

    public UsuarioDetalles(String username, String password, Collection<? extends GrantedAuthority> authorities, Long idCodigoTributario) {
        super(username, password, authorities);
        this.idCodigoTributario = idCodigoTributario;
    }

    // Métodos adicionales, como getters y setters
    public Long getIdCodigoTributario() {
        return idCodigoTributario;
    }

    public void setIdCodigoTributario(Long idCodigoTributario) {
        this.idCodigoTributario = idCodigoTributario;
    }
}
