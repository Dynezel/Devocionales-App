package dylan.devocionalesspring.entidades;

import  com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import dylan.devocionalesspring.enumeraciones.Rol;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Usuario implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    private String nombre;
    private String email;
    private String celular;
    private String contrasenia;
    private String contrasenia2;

    @OneToOne(orphanRemoval = true)
    @JoinColumn(name = "imagen_id")
    private Imagen fotoPerfil;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    @OneToMany(mappedBy = "autor", cascade = CascadeType.ALL)
    private List<Devocional> devocionales;

    @OneToMany(mappedBy = "usuario")
    private List<Comentario> comentarios;


}

// private String resetPwToken;