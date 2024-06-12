package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.dto.DevocionalDTO;
import dylan.devocionalesspring.dto.UsuarioDTO;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.excepciones.UsuarioNoEncontradoExcepcion;
import dylan.devocionalesspring.mapper.UsuarioMapper;
import dylan.devocionalesspring.repositorios.DevocionalRepositorio;
import dylan.devocionalesspring.servicios.DevocionalServicio;
import dylan.devocionalesspring.servicios.UsuarioServicio;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@CrossOrigin("http://localhost:5173")
public class DevocionalControlador {

    @Autowired
    DevocionalServicio devocionalServicio;

    @Autowired
    DevocionalRepositorio devocionalRepositorio;

    @Autowired
    UsuarioServicio usuarioServicio;

    @Autowired
    UsuarioMapper usuarioMapper;

    @GetMapping("/")
    public String indice() {
        return "Hola, funcionó";
    }

    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMINISTRADOR')")
    @GetMapping("/devocionales")
    public List<Devocional> listarDevocionalesConAutor() {
        return devocionalRepositorio.findAllWithAutor();
    }

    @PostMapping("/devocionales/registro")
    public ResponseEntity<DevocionalDTO> crearDevocional(@RequestBody DevocionalDTO devocionalDTO, Authentication authentication) throws UsuarioNoEncontradoExcepcion {
        String email = authentication.getName();
        UsuarioDTO usuarioDTO = usuarioServicio.obtenerPerfilUsuarioDTO(email);
        if (usuarioDTO == null) {
            throw new UsuarioNoEncontradoExcepcion("Usuario no encontrado: " + email);
        }

        // Convertimos UsuarioDTO a Usuario
        Usuario usuario = usuarioMapper.toUsuario(usuarioDTO);

        // Crear Devocional
        DevocionalDTO creadoDevocional = devocionalServicio.crearDevocional(
                devocionalDTO.getNombre(),
                devocionalDTO.getDescripcion(),
                devocionalDTO.getFechaCreacion(),
                usuario
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(creadoDevocional);
    }



    @PutMapping("/modificar/{id}")
    public boolean modificarDevocional(@PathVariable int id, @RequestBody DevocionalDTO devocional) {
        return devocionalServicio.modificarDevocional(id, devocional.getNombre(), devocional.getDescripcion());
    }

    @GetMapping("/listar")
    public List<DevocionalDTO> listarDevocionales() {
        return devocionalServicio.obtenerTodosDevocionales();
    }

    @GetMapping("/encontrar/{id}")
    public Optional<Devocional> encontrarDevocionalPorId(@PathVariable int id) {
        return devocionalServicio.obtenerDevocionalPorId(id);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarDevocional(@PathVariable int id) {
        devocionalServicio.eliminarDevocional(id);
    }
}
