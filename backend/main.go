package main

import (
	"os"
	"shopmarket/controllers"
	"shopmarket/middlewares"
	"shopmarket/repositories"
	"shopmarket/services"
	"shopmarket/infra"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"gorm.io/gorm"
)

func setupRouter(db *gorm.DB) *gin.Engine {
	itemRepository := repositories.NewItemRepository(db)
	itemService := services.NewItemService(itemRepository)
	itemController := controllers.NewItemController(itemService)

	authRepository := repositories.NewAuthRepository(db)
	authService := services.NewAuthService(authRepository)
	authController := controllers.NewAuthController(authService)

	router := gin.Default()
	
	// CORS設定
	corsConfig := cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * 3600, // 12時間
	}
	
	// 開発環境: 複数のlocalhostポートを許可
	corsConfig.AllowOrigins = []string{
		"http://localhost:3001",
		"http://localhost:3002",
		"http://localhost:3003",
	}
	
	router.Use(cors.New(corsConfig))
	
	
	itemRouter := router.Group("/items")
	itemRouterWithAuth := router.Group("/items", middlewares.AuthMiddleware(authService))
	itemRouter.GET("", itemController.FindAll)
	itemRouterWithAuth.GET("/:id", itemController.FindById)
	itemRouterWithAuth.POST("", itemController.Create)
	itemRouterWithAuth.PUT("/:id", itemController.Update)
	itemRouterWithAuth.DELETE("/:id", itemController.Delete)

	
	authRouter := router.Group("/auth")
	authRouter.POST("/signup", authController.Signup)
	authRouter.POST("/login", authController.Login)
	
	return router

}

func main() {
	// インフラストラクチャの初期化
	infra.Initialize()
	db := infra.SetupDB()
	router := setupRouter(db)
	
	// ポート設定（本番環境対応）
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	// 環境に応じたサーバー起動
	if os.Getenv("ENV") == "prod" {
		// 本番環境
		router.Run(":" + port)
	} else {
		// 開発環境
		router.Run("localhost:" + port)
	}
}

