package dylan.devocionalesspring.mapper;

import dylan.devocionalesspring.dto.DevocionalDTO;
import dylan.devocionalesspring.entidades.Devocional;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DevocionalMapper {

    DevocionalDTO toDevocionalDTO(Devocional devocional);

    Devocional toDevocional(DevocionalDTO devocionalDTO);
}