package main

import (
	"os"
	"strings"
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
	corsConfig := cors.DefaultConfig()
	
	// 環境に応じてCORS設定を変更
	if os.Getenv("ENV") == "prod" {
		// 本番環境: 特定のオリジンのみ許可
		allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
		if allowedOrigins != "" {
			corsConfig.AllowOrigins = strings.Split(allowedOrigins, ",")
		} else {
			// デフォルトで一般的なVercelドメインを許可
			corsConfig.AllowOrigins = []string{
				"https://*.vercel.app",
				"https://shopmarket-frontend.vercel.app",
			}
		}
	} else {
		// 開発環境: localhost許可
		corsConfig.AllowOrigins = []string{
			"http://localhost:3000",
			"http://localhost:3003",
		}
	}
	
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	corsConfig.AllowCredentials = true
	
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
  infra.Initialize()
  db := infra.SetupDB()
  router := setupRouter(db)
  
  // ポート設定（本番環境対応）
  port := os.Getenv("PORT")
  if port == "" {
    port = "8080"
  }
  
  // 本番環境では全てのインターフェースでリッスン
  if os.Getenv("ENV") == "prod" {
    router.Run(":" + port)
  } else {
    router.Run("localhost:" + port)
  }
}

