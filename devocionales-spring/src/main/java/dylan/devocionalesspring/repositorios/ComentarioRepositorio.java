package dylan.devocionalesspring.repositorios;

import dylan.devocionalesspring.entidades.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepositorio extends JpaRepository<Comentario, Long> {
}