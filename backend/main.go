package main

import (
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
	router.Use(cors.Default())
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
  router.Run("localhost:8080")
}

