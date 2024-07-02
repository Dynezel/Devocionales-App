package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.excepciones.UsuarioNoEncontradoExcepcion;
import dylan.devocionalesspring.repositorios.DevocionalRepositorio;
import dylan.devocionalesspring.repositorios.UsuarioRepositorio;
import dylan.devocionalesspring.servicios.DevocionalServicio;
import dylan.devocionalesspring.servicios.UsuarioServicio;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@RestController
@CrossOrigin("http://localhost:5173")
public class DevocionalControlador {

    @Autowired
    DevocionalServicio devocionalServicio;

    @Autowired
    DevocionalRepositorio devocionalRepositorio;

    @Autowired
    UsuarioRepositorio usuarioRepositorio;

    @Autowired
    UsuarioServicio usuarioServicio;

    @GetMapping("/")
    public String indice() {
        return "Hola, funcionó";
    }

    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMINISTRADOR')")
    @GetMapping("/devocionales")
    public List<Devocional> listarDevocionalesConAutor() {
        return devocionalRepositorio.findAll();
    }


    @PostMapping("/devocionales/registro")
    public ResponseEntity<Devocional> crearDevocional(@RequestBody Devocional devocional, Authentication authentication) throws UsuarioNoEncontradoExcepcion {
        String email = authentication.getName();
        Devocional creadoDevocional = usuarioServicio.agregarDevocionalAUsuario(email, devocional);
        return new ResponseEntity<>(creadoDevocional, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/vistas")
    public ResponseEntity<Void> incrementarVistas(@PathVariable Long id) {
        devocionalServicio.incrementarVistas(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/likes")
    public ResponseEntity<Void> incrementarLikes(@RequestParam Long devocionalId) {
        devocionalServicio.incrementarLikes(devocionalId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/modificar/{id}")
    public boolean modificarDevocional(@PathVariable int id, @RequestBody Devocional devocional) {
        return devocionalServicio.modificarDevocional(id, devocional.getNombre(), devocional.getDescripcion());
    }

    @GetMapping("/listar")
    public List<Devocional> listarDevocionales() {
        return devocionalServicio.obtenerTodosDevocionales();
    }

    @GetMapping("/encontrar/{id}")
    public Optional<Devocional> encontrarDevocionalPorId(@PathVariable int id) {
        return devocionalServicio.obtenerDevocionalPorId(id);
    }

    // Endpoint para buscar devocionales por título
    @GetMapping("/devocionales/buscar")
    public List<Devocional> buscarDevocionalesPorNombre(@RequestParam String nombre) {
        return devocionalRepositorio.findByNombreContainingIgnoreCase(nombre);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarDevocional(@PathVariable int id) {
        devocionalServicio.eliminarDevocional(id);
    }
}
