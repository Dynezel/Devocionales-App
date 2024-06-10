package dylan.devocionalesspring.servicios;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import dylan.devocionalesspring.entidades.Imagen;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.enumeraciones.Rol;
import dylan.devocionalesspring.excepciones.MiExcepcion;
import dylan.devocionalesspring.excepciones.UsuarioNoEncontradoExcepcion;
import dylan.devocionalesspring.repositorios.UsuarioRepositorio;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Service
@Transactional
public class UsuarioServicio implements UserDetailsService {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private HttpServletRequest request;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    //@Autowired
    //JavaMailSender javaMailSender;

    @Autowired
    private ImagenServicio imagenServicio;

    public void registrarUsuario(String nombre,
                                 String email,
                                 String celular,
                                 String contrasenia,
                                 String contrasenia2,
                                 MultipartFile archivo) throws MiExcepcion, IOException {
        validarDatosRegistro(nombre, email, celular, contrasenia, contrasenia2);
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setCelular(celular);
        usuario.setContrasenia(new BCryptPasswordEncoder().encode(contrasenia));
        usuario.setRol(Rol.USUARIO);

        if (!archivo.isEmpty()) {
            Imagen fotoPerfil = imagenServicio.guardarImagen(archivo);
            usuario.setFotoPerfil(fotoPerfil);
        }
        usuarioRepositorio.save(usuario);
    }

    @Transactional
    public void modificarUsuario(Long idUsuario, String nombre, String celular) throws MiExcepcion {
        // Validar los datos modificados si es necesario

        // Obtener el usuario actual desde el repositorio
        Usuario usuarioActual = getOne(idUsuario);

        // Actualizar solo el nombre y el celular
        usuarioActual.setNombre(nombre);
        usuarioActual.setCelular(celular);

        // Guardar los cambios en el repositorio
        usuarioRepositorio.save(usuarioActual);
    }

    @Transactional
    public void setImagenUsuario(MultipartFile archivo, Long idUsuario) throws Exception {
        Usuario usuario = usuarioRepositorio.buscarPorIdUsuario(idUsuario);

        if (usuario == null) {
            System.out.println("error"); // Manejar el caso en el que no se encuentre el usuario con el código tributario dado.
            return;
        }

        Imagen imagen = imagenServicio.guardarImagen(archivo);// Manejar errores de lectura de bytes de la imagen

        usuario.setFotoPerfil(imagen);
        // Guardar el usuario actualizado
        usuarioRepositorio.save(usuario);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepositorio.buscarPorEmail(email);

        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado con el email: " + email);
        }

        List<GrantedAuthority> permisos = new ArrayList<>();
        GrantedAuthority p = new SimpleGrantedAuthority("ROLE_" + usuario.getRol().toString());
        permisos.add(p);

        // Obtener la sesión y agregar el usuario a la sesión
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpSession session = attr.getRequest().getSession(true);
        session.setAttribute("usuariosession", usuario);

        return new UsuarioDetalles(
                usuario.getEmail(),
                usuario.getContrasenia(),
                permisos,
                usuario.getIdUsuario()
        );
    }

    // Nuevo método para obtener el perfil completo del usuario
    public Usuario obtenerPerfilUsuario(String email) throws UsuarioNoEncontradoExcepcion {
        Usuario usuario = usuarioRepositorio.buscarPorEmail(email);
        if (usuario == null) {
            throw new UsuarioNoEncontradoExcepcion("No se encontró un usuario con el email: " + email);
        }
        usuario.setFotoPerfil(usuario.getFotoPerfil());
        return usuario;
    }

    public Usuario obtenerUsuarioPorId(Long idUsuario) throws UsuarioNoEncontradoExcepcion {
        Usuario usuario = usuarioRepositorio.buscarPorIdUsuario(idUsuario);
        if (usuario == null) {
            throw new UsuarioNoEncontradoExcepcion("No se encontró un usuario con el id: " + idUsuario);
        }
        usuario.setFotoPerfil(usuario.getFotoPerfil());
        return usuario;
    }

    public Usuario obtenerUsuarioPorNombre(String nombre) throws UsuarioNoEncontradoExcepcion {
        Usuario usuario = usuarioRepositorio.buscarPorNombre(nombre);
        if (usuario == null) {
            throw new UsuarioNoEncontradoExcepcion("No se encontró un usuario con el nombre: " + nombre);
        }
        usuario.setFotoPerfil(usuario.getFotoPerfil());
        return usuario;
    }

    @Transactional(readOnly = true)
    public Usuario getOne(Long idUsuario) {
        return usuarioRepositorio.getOne(idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarUsuarios() {

        return usuarioRepositorio.findAll();
    }

    //@Transactional
    //public void darBajaUsuario(String idCodigoTributario) {
    //    Optional<Usuario> respuesta = usuarioRepositorio.findById(idCodigoTributario);
    //    if (respuesta.isPresent()) {
    //        Usuario usuario = respuesta.get();
    //        usuario.setAlta(false);
    //
    //        usuarioRepositorio.save(usuario);
    //    }
    //}

    //@Transactional
    //public void darAltaUsuario(String idCodigoTributario) {
    //    Optional<Usuario> respuesta = usuarioRepositorio.findById(idCodigoTributario);
    //    if (respuesta.isPresent()) {
    //        Usuario usuario = respuesta.get();
    //        usuario.setAlta(true);
    //
    //        usuarioRepositorio.save(usuario);
    //    }
    //}

    @Transactional
    public void eliminarUsuario(Long idCodigoTributario) {
        Optional<Usuario> respuesta = usuarioRepositorio.findById(idCodigoTributario);
        if (respuesta.isPresent()) {
            Usuario usuario = respuesta.get();

            usuarioRepositorio.delete(usuario);
        }
    }

    @Transactional(readOnly = true)
    public Usuario obtenerUsuarioPorUsername(String username) throws MiExcepcion {
        Usuario usuario = usuarioRepositorio.buscarPorEmail(username);
        if (usuario == null) {
            throw new MiExcepcion("No se encontró un usuario con el username: " + username);
        }
        return usuario;
    }

    //public void updateResetPwToken(String token, String email) throws UsuarioNoEncontradoExcepcion {
    //
    //    Usuario usuario = usuarioRepositorio.buscarPorEmail(email);
    //
    //    if (usuario != null) {
    //        usuario.setResetPwToken(token);
    //        usuarioRepositorio.save(usuario);
    //    } else {
    //        throw new UsuarioNoEncontradoExcepcion("No pudimos encontrar ningún usuario con el email" + email);
    //    }
    //}

    //public Usuario getResetPwToken(String token) {

    //    return usuarioRepositorio.buscarPorResetPwToken(token);
    //}

    //public void updatePassword(Usuario usuario, String newPassword) throws MiExcepcion {
    //    validarContrasenia(newPassword);
    //    System.out.println(usuario);
    //    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    //    String encodePassword = passwordEncoder.encode(newPassword);
    //    usuario.setContrasenia(encodePassword);
    //
    //    usuario.setResetPwToken(null);
    //    usuarioRepositorio.save(usuario);
    //}

    public void validarDatosRegistro(String nombre,
                                     String email,
                                     String celular,
                                     String contrasenia,
                                     String contrasenia2) throws MiExcepcion {

        validarCadena(nombre, "El nombre no puede ser vacío o nulo.");
        validarCadena(email, "El email no puede ser vacío o nulo.");
        validarCadena(celular, "El numero de celular no puede ser vacío o nulo.");
        validarContrasenia(contrasenia);
        if (!contrasenia.equals(contrasenia2)) {
            throw new MiExcepcion("Las contraseñas ingresadas deben ser iguales");
        }
    }
    void validarCadena(String valor, String mensajeError) throws MiExcepcion {
        if (valor == null || valor.trim().isEmpty()) {
            throw new MiExcepcion(mensajeError);
        }
    }

    public void validarDatosModificar(String email, String celular) throws MiExcepcion {

        if (email == null || email.isEmpty()) {
            throw new MiExcepcion("El email no puede estar vacío, ni haber sido registrado anteriormente");
        }
        if (celular == null || celular.isEmpty()) {
            throw new MiExcepcion("El celular no puede estar vacío o ser nulo");
        }
    }

    public void validarContrasenia(String contrasenia) throws MiExcepcion {
        if (contrasenia == null || contrasenia.length() <= 5) {
            throw new MiExcepcion("La contraseña no puede estar vacía, y debe tener más de 5 dígitos");
        }

    }

}
