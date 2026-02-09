package com.example.jutjubic.service;

import com.example.jutjubic.dto.WatchPartyDto;
import com.example.jutjubic.model.WatchParty;

public interface WatchPartyService {
    WatchParty create(WatchPartyDto watchPartyDto);
}
