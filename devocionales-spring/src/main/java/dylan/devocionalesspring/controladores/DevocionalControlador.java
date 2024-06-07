package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.excepciones.UsuarioNoEncontradoExcepcion;
import dylan.devocionalesspring.servicios.DevocionalServicio;
import dylan.devocionalesspring.servicios.UsuarioDetalles;
import dylan.devocionalesspring.servicios.UsuarioServicio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class DevocionalControlador {

    private static final Logger logger =
            LoggerFactory.getLogger(DevocionalControlador.class);
    
    @Autowired
    DevocionalServicio devocionalServicio;

    @Autowired
    UsuarioServicio usuarioServicio;

    @GetMapping("/")
    public String indice() {
        return "Hola, funcionó";
    }

    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMIN')")
    @GetMapping("/devocionales")
    public List<Devocional> listarDevocionales() {
        return devocionalServicio.listarDevocionales();
    }

    @PostMapping("/devocionales/registro")
    public Devocional crearDevocional(Authentication authentication, @RequestBody Devocional devocional) throws UsuarioNoEncontradoExcepcion {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }

        String email = authentication.getName();
        Usuario usuario = usuarioServicio.obtenerPerfilUsuario(email);

        return devocionalServicio.crearDevocional(devocional.getNombre(), devocional.getDescripcion(), devocional.getFechaCreacion(), usuario);
    }


    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMIN')")
    @PutMapping("/devocionales/modificar/{id}")
    public ResponseEntity<String> modificarDevocional(@PathVariable int id, @RequestBody Devocional devocional) {
        boolean modificacionExitosa = devocionalServicio.modificarDevocional(id, devocional.getNombre(), devocional.getDescripcion());
        if (modificacionExitosa) {
            return ResponseEntity.ok("La devocional se ha modificado con exito");
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La devocional no se encontró o no se pudo modificar");
        }
    }

    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMIN')")
    @DeleteMapping("/devocionales/eliminar/{id}")
    public ResponseEntity<String> eliminarDevocional(@PathVariable int id) {
        devocionalServicio.eliminarDevocional(id);
        return ResponseEntity.ok("devocional eliminada con exito");
    }

}
