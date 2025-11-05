package infra

import (
	"log"
	"github.com/joho/godotenv"
)

func Initialize() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("Warning: .env file not found, using default environment variables")
	}
}