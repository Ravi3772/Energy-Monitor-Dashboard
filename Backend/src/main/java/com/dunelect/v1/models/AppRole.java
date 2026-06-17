package com.dunelect.v1.models;

public enum AppRole {
	ADMIN,
	OPERATOR;

	public String authority() {
		return "ROLE_" + name();
	}
}
