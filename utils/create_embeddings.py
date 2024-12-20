from api.calc_cosine_similarity import find_cosine_similarity, find_embedding , find_relevant_file_paths
import os
import pickle
embeddings_titles = []
if not os.path.exists('embeddings.pkl'):
    #Find embeddings of titles from titles.txt
    titles = []
    #if embedding_titles.pkl is absent
    with open('titles.txt', 'r') as file:
        lines = file.readlines()
    
    titles = [line.strip() for line in lines]
    print("Created a list of titles")
        
    embeddings_titles = find_embedding(titles)
    #Save embeddings_titles to embedding_titles.pkl
    data = {
            'sentences': titles,
            'embeddings': embeddings_titles
    }
    with open('embeddings.pkl', 'wb') as f:
        pickle.dump(data, f)
