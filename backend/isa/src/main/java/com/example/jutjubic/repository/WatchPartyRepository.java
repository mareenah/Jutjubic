package com.example.jutjubic.repository;

import com.example.jutjubic.model.WatchParty;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WatchPartyRepository extends JpaRepository<WatchParty, UUID> {
    @EntityGraph(attributePaths = {
            "creator",
            "creator.address",
            "members",
            "members.address",
            "post"
    })
    List<WatchParty> findByCreator_Id(UUID creatorId);

    boolean existsByCreator_Id(UUID creatorId);

    @EntityGraph(attributePaths = {
            "creator",
            "creator.address",
            "members",
            "members.address",
            "post"
    })
    Optional<WatchParty> findById(UUID id);

    boolean existsByMembers_Id(UUID userId);

    @EntityGraph(attributePaths = {
            "creator",
            "creator.address",
            "members",
            "members.address",
            "post"
    })
    List<WatchParty> findByMembers_Id(UUID memberId);

}
