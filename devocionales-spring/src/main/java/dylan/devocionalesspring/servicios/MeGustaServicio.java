package dylan.devocionalesspring.servicios;

import dylan.devocionalesspring.entidades.MeGusta;
import dylan.devocionalesspring.repositorios.MeGustaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class MeGustaServicio {

    @Autowired
    private MeGustaRepositorio meGustaRepositorio;

    public MeGusta darMeGusta(Long usuarioId, Long devocionalId) {
        Optional<MeGusta> meGustaExistente = meGustaRepositorio.findByUsuarioIdAndDevocionalId(usuarioId, devocionalId);

        if (meGustaExistente.isPresent()) {
            meGustaRepositorio.delete(meGustaExistente.get());
            return null;
        } else {
            MeGusta nuevoMeGusta = new MeGusta();
            nuevoMeGusta.setUsuarioId(usuarioId);
            nuevoMeGusta.setDevocionalId(devocionalId);
            return meGustaRepositorio.save(nuevoMeGusta);
        }
    }

    public long contarMeGustasPorDevocional(Long devocionalId) {
        return meGustaRepositorio.countByDevocionalId(devocionalId);
    }
}
