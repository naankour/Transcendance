

all:
	docker compose up --build

# stop les containers sans supprimer les données
clean:
	docker compose down

# full reset, supprime TOUT !
fclean:
	docker compose down --volumes --rmi all

re: fclean all

.PHONY: all clean fclean re