from sentence_transformers import SentenceTransformer, util
import torch

# Load the pre-trained model
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

def find_cosine_similarity(text1, text2):
  global model
  # Encode the texts to get their embeddings
  embedding1 = model.encode(text1, convert_to_tensor=True)
  embedding2 = model.encode(text2, convert_to_tensor=True)
  
  # Compute cosine similarity
  cosine_sim = util.pytorch_cos_sim(embedding1, embedding2)
  
  # Print the cosine similarity score
  #print(f"Cosine Similarity: {cosine_sim.item()}")
  return cosine_sim.item()

def find_embedding(texts, lim=None):
    global model
    embeddings = []

    c = 0

    for text in texts:
        if lim and c > lim:
            continue
        else:
            c += 1
        print(f"Finding embedding for {text}")
        embeddings.append(model.encode(text, convert_to_tensor=True))

    return embeddings

def find_relevant_file_paths(ingredient, embeddings, titles, folder_name, journal_str = None, N=2, thres=0.7):
    global model
    file_paths = []
    file_titles = []
    refs = []

    embedding_ingredient = model.encode(ingredient, convert_to_tensor=True)
    cosine_sims_dict = {}
    cosine_sims_title = {}
  
    title_num = 0
    for embedding in embeddings:
        # Compute cosine similarity
        title_num += 1
        cosine_sim = util.pytorch_cos_sim(embedding_ingredient, embedding)
        cosine_sims_dict.update({title_num:cosine_sim})
        cosine_sims_title.update({titles[title_num-1]:cosine_sim})

    #Sort cosine_sims_dict based on value of cosine_sim
    top_n_cosine_sims_dict = dict(sorted(cosine_sims_dict.items(), key=lambda item: item[1], reverse=True)[:N])
    top_n_cosine_sims_title = dict(sorted(cosine_sims_title.items(), key=lambda item: item[1], reverse=True)[:N])

    print(f"DEBUG : Ingredient {ingredient} top_n_cosine_sims_dict : {top_n_cosine_sims_dict} top_n_cosine_sims_title : {top_n_cosine_sims_title}")
    
    for key, value in top_n_cosine_sims_dict.items():
        if value.item() > thres:
            file_paths.append(f"{folder_name}/article{key}.txt")
            file_titles.append(titles[key-1])
            #Read lines after "References:" from {folder_name}/article{key}.txt
            start = 0
            for line in open(f"{folder_name}/article{key}.txt").readlines():
              if line.strip() == "References:" and start == 0:
                start = 1
                continue
              if start == 1:
                if journal_str is not None and journal_str in line.strip():
                  refs.append(line.strip())
  
    print(f"Returning citations : {list(set(sorted(refs)))}")    
    return file_paths, file_titles, list(set(sorted(refs)))
    
