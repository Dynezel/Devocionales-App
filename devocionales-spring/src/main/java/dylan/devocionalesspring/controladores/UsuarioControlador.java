package dylan.devocionalesspring.controladores;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.enumeraciones.Rol;
import dylan.devocionalesspring.excepciones.MiExcepcion;
import dylan.devocionalesspring.servicios.UsuarioServicio;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/usuario")
public class UsuarioControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    //registroControlador
    @PostMapping("/registro")
    public ResponseEntity<String> registro(@RequestParam("archivo") MultipartFile archivo,
                                           @RequestParam("nombre") String nombre,
                                           @RequestParam("email") String email,
                                           @RequestParam("celular") String celular,
                                           @RequestParam("contrasenia") String contrasenia,
                                           @RequestParam("contrasenia2") String contrasenia2) {
        try {
            // Aquí puedes usar los datos del formulario junto con el archivo adjunto
            usuarioServicio.registrarUsuario(nombre, email, celular, contrasenia, contrasenia2, archivo);

            return ResponseEntity.ok("Usuario registrado correctamente");
        } catch (MiExcepcion ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor, AYUDAAA");
        }
    }

    // Endpoint para obtener el perfil del usuario
    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMIN')")
    @GetMapping("/perfil")
    public ResponseEntity<Usuario> obtenerPerfil(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuariosession");
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // Endpoint para subir la foto de perfil
    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMIN')")
    @PostMapping("/perfil/foto")
    public ResponseEntity<String> subirFotoPerfil(@RequestParam("archivo") MultipartFile archivo,
                                                  HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuariosession");
        if (usuario != null) {
            try {
                usuarioServicio.setImagenUsuario(archivo, usuario.getIdUsuario());
                return ResponseEntity.ok("Su imagen se subió correctamente!");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error al subir la imagen: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // Endpoint para modificar los datos del usuario
    @PreAuthorize("hasAnyRole('ROLE_USUARIO','ROLE_ADMIN')")
    @PostMapping("/perfil/modificar/{idUsuario}")
    public ResponseEntity<String> modificar(@PathVariable("idUsuario") Long idUsuario,
                                            @RequestParam("nombre") String nombre,
                                            @RequestParam("celular") String celular) {
        try {
            // Llamada al método del servicio para modificar el usuario
            usuarioServicio.modificarUsuario(idUsuario, nombre, celular);

            return ResponseEntity.ok("Nombre y celular del usuario actualizados correctamente");
        } catch (MiExcepcion ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor");
        }
    }

    // Endpoint para listar todos los usuarios
    @GetMapping("/lista")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioServicio.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/eliminar/{idUsuario}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable("idUsuario") Long idUsuario) {
        try {
            usuarioServicio.eliminarUsuario(idUsuario);
            return ResponseEntity.ok("Usuario eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el usuario");
        }
    }

    //@GetMapping("/dar-alta/{idUsuario}")
    //public ResponseEntity<String> darAltaUsuario(@PathVariable("idUsuario") String idUsuario) {
    //    try {
    //        usuarioServicio.darAltaUsuario(idUsuario);
    //        return ResponseEntity.ok("Usuario dado de alta correctamente");
    //    } catch (Exception e) {
    //        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al dar de alta al usuario");
    //    }
    //}

    //@GetMapping("/dar-baja/{idUsuario}")
    //public ResponseEntity<String> darBajaUsuario(@PathVariable("idUsuario") String idUsuario) {
    //    try {
    //        usuarioServicio.darBajaUsuario(idUsuario);
    //        return ResponseEntity.ok("Usuario dado de baja correctamente");
    //    } catch (Exception e) {
    //        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al dar de baja al usuario");
    //    }
    //}


    /*
    Evaluando la incorporacion de este metodo para optimizar el codigo de las validaciones. ->  Emi
    
    private ResponseEntity<?> validation(BindingResult result) {
                Map<String, String> errors = new HashMap<>();

        result.getFieldErrors().forEach(err -> {
            errors.put(err.getField(), "El campo " + err.getField() + " " + err.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(errors);
    }
update(@Valid @RequestBody UserRequest user, BindingResult result, @PathVariable Long id)
if(result.hasErrors()){
            return validation(result);
        }*/
}
