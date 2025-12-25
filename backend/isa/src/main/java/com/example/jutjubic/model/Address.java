package com.example.jutjubic.model;

import jakarta.persistence.*;
import org.springframework.cache.annotation.EnableCaching;

import java.util.UUID;

@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "country")
    private String country;

    @Column(name = "city")
    private String city;

    @Column(name = "street")
    private String street;

    @Column(name = "number")
    private String number;
}
