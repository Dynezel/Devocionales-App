package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.servicios.DevocionalServicio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
public class DevocionalControlador {

    private static final Logger logger =
            LoggerFactory.getLogger(DevocionalControlador.class);
    
    @Autowired
    DevocionalServicio devocionalServicio;

    @GetMapping("/")
    public String indice() {
        return "Hola";
    }

    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMIN')")
    @GetMapping("/devocionales")
    public List<Devocional> listarDevocionales() {
        return devocionalServicio.listarDevocionales();
    }

    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMIN')")
    @PostMapping("/devocionales/registro")
    public Devocional crearDevocional(@RequestBody Devocional devocional) {
        return devocionalServicio.crearDevocional(devocional.getNombre(), devocional.getDescripcion(), devocional.getFechaCreacion());
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
