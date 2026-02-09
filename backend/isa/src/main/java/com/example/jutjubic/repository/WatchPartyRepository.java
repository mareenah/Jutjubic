package com.example.jutjubic.repository;

import com.example.jutjubic.model.WatchParty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WatchPartyRepository extends JpaRepository<WatchParty, UUID> {
}
