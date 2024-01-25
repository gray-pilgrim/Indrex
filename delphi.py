from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import json
import openai
import os

app = Flask(__name__)
CORS(app)


def generate_openai_response(prompt):
	client = openai.OpenAI(api_key="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")
	stream = client.chat.completions.create(
		model="gpt-4",
		messages=[{"role": "user", "content": f"{prompt}"}],
		stream=True,
	)
	generated_content = ''
	for chunk in stream:
		if chunk.choices[0].delta.content is not None:
			generated_content += chunk.choices[0].delta.content
	return generated_content

def load_latest_question(file):
	if os.path.exists(file+".txt"):
		with open(file+".txt", 'r') as f:
			return f.read().strip()
	else:
		with open(file+".txt", 'w+') as f:
			if file == "Blindness":
				f.write("Can a blind person operate this product without the aid of visual cues? Does the product offer auditory or tactile feedback to support use by individuals who are blind? Please give the product a preliminary percentage rating out of 100 with regards to its accessibility to blind people. What additional products, if any, might enhance accessibility for a blind person?")
			if file == "Deafness":
				f.write("Can a deaf person operate this product without the aid of auditory cues? Does the product offer visual or tactile feedback to support use by individuals who are deaf? Please give the product a preliminary percentage rating out of 100 with regards to its accessibility to deaf people. What additional products, if any, might enhance accessibility for a deaf person?")
			if file == "Nonverbal":
				f.write("What issues may a nonverbal person have while using this product? Does this product need to be spoken to to operate it? Does this product offer any tactile or visual features that to allow the nonverbal operator to operate this particular product? Please give the product a preliminary percentage rating out of 100 with regards to its accessibility to nonverbal operators.What additional supporting products might a nonverbal person require to operate this product?")
			if file == "HardofHearing":
				f.write("What issues may a hearing impaired person have while using this product? Does this product need purely audio cues to operate it? Does this product offer any tactile, visual or olfactory cues to help the hearing impaired operator to operate this particular product? Please give the product a preliminary percentage rating out of 100 with regards to its accessibility to hearing impaired operators.What additional supporting products might a hearing impaired person require to operate this product?")
			if file == "Lowvision":
				f.write("What issues may a visually impaired (low_vision) person have while using this product? Does this product need purely visual cues to operate it? Does this product offer any tactile, auditory or olfactory cues to help the visually impaired (low_vision) operator to operate this particular product? Please give the product a preliminary percentage rating out of 100 with regards to its accessibility to visually impaired (low_vision) operators.What additional supporting products might a visually impaired (low_vision) person require to operate this product?")
			if file == "outputer":
				f.write()
			return f.read().strip()
		

def save_latest_question(file,question):
	with open(file+".txt", 'w') as file:
		file.write(question)

@app.route('/receive_html', methods=['POST'])
def receive_html():
	
	data = request.get_json()  # Use get_json() for parsing JSON data
	if not data:
		return jsonify({'error': 'No data received'}), 400

	html_data = data.get('htmlContent')
	disability_type = data.get('disabilityType')
	preliminary_text = data.get('preliminaryType')
	if preliminary_text != None:
		print("I have the following disability: "+preliminary_text+".\n")
	if disability_type != None:
		print("Some additional info is "+disability_type+" .\n")
	sp=BeautifulSoup(html_data,'html.parser')
	st='Product Details'
	prod_dets = print_text_in_parent_div_childs(sp,st)
	if prod_dets == None:
		prod_dets = print_text_in_grandparent_div_childs(sp,st)
	specs = print_text_in_parent_div_childs(sp,'Specifications')
	if(specs == None):
		specs = print_text_print_text_in_grandparent_div_childsin_parent_div_childs(sp,'Specifications')
	prod_desc = print_text_in_parent_div_childs(sp,'Product Description')
	if(prod_desc == None):
		prod_desc = print_text_print_text_in_grandparent_div_childsin_parent_div_childs(sp,'Product Description')
	price = sp.find('div', {'class': '_30jeq3 _16Jk6d'}).text
	prod_name = sp.find('span', {'class': 'B_NuCI'}).text
	prompt = ""
	question = ""
	if(prod_name != None):
		prompt += "Product name is "+prod_name+". \n"
	if(price != None):
		prompt += "Price is "+price+". \n"
	if(prod_desc != None):
		prompt += "Product description is "+prod_desc+". \n"
	if(prod_dets != None):
		prompt += "Product details are "+prod_dets+". \n"
	if(specs != None):
		prompt += "Specifications are "+specs+". \n"
	if preliminary_text != None:
		prompt = "Data:{\""+prompt+"\"}\n"+"Question:"
		if(preliminary_text == "Blindness"):
			q = "Blindness"
			prompt += load_latest_question("Blindness")
			question += load_latest_question("Blindness")
		elif(preliminary_text == "Deafness"):
			q = "Deafness"
			prompt += load_latest_question("Deafness")
			question += load_latest_question("Deafness")
		elif(preliminary_text == "Nonverbal"):
			q = "Nonverbal"
			prompt += load_latest_question("Nonverbal")
			question += load_latest_question("Nonverbal")
		elif(preliminary_text == "HardofHearing"):
			q = "HardofHearing"
			prompt += load_latest_question("HardofHearing")
			question += load_latest_question("HardofHearing")
		elif(preliminary_text == "Lowvision"):
			q = "Lowvision"
			question += load_latest_question("Lowvision")
			prompt += load_latest_question("Lowvision")
	prompt += (disability_type + ".")

	prompt += "\n\n\"Perform an accessibility analysis of a specified product, focusing on inclusivity for diverse disabilities. Include in your analysis:{'inclusivity_analysis': Textual details on accessibility barriers for disabilities.'inclusivity_rating': A 0-100 numerical accessibility score. If the product needs an abled operator to help the disabled person the rating is 15.'augmenting_products': List of products enhancing accessibility for various disabilities.'improved_prompt': A revised version of this \'"+question+"\' for better analysis. The revised version should work only on the text in \'"+question+"\' and on nothing else.} Each item should correspond to a JSON key as named."	

	response = generate_openai_response(prompt)
	print("\n\n\n\n\n\n\n\n")
	print(prompt)
	print("\n\n\n\n\n\n\n\n===================================")
	print(response)
	print("==============================\n\n\n\n\n\n\n\n")
	json_obj = json.loads(response)
	save_latest_question(q,json_obj['improved_prompt'])
	print("improved question: "+json_obj['improved_prompt'])
	return jsonify(json_obj)


def print_text_in_parent_div_childs(soup, search_text):
	"""
	Extracts information from a specified div and structures it in a JSON format.

	:param soup: BeautifulSoup object of the HTML content
	:param search_text: Text to search for in a div
	:return: JSON formatted data
	"""
	# Find the div with the specified text
	target_div = soup.find('div', string=search_text)

	# Check if the div is found
	if not target_div:
		return "No div with '{}' found".format(search_text)

	# Get the parent div
	parent_div = target_div.parent

	# Check if parent div is found
	if not parent_div:
		return "Parent div not found"

	# Get the second child div of the parent div
	second_child_div = parent_div.find_all('div')[1]

	# Initialize a dictionary to store the extracted data
	extracted_data = {}

	# Iterate through each child in the second child div
	for child in second_child_div.children:
		if child.name == 'div':
			# Initialize variables to store title and section data
			title = None
			section_data = {}

			# Iterate through each grandchild
			for grandchild in child.children:
				if grandchild.name == 'div':
					# Check if title is not yet set, then set it as the first div's text
					if not title:
						title = grandchild.get_text(strip=True)
					else:
						# Process the table data
						table = grandchild.find('table')
						if table:
							for row in table.find_all('tr'):
								cols = row.find_all('td')
								if len(cols) >= 2:
									key = cols[0].get_text(strip=True)
									value = cols[1].get_text(strip=True)
									section_data[key] = value

			# Add the extracted section data to the main dictionary
			if title:
				extracted_data[title] = section_data

	return json.dumps(extracted_data, indent=4)

def print_text_in_grandparent_div_childs(soup, search_text):
	"""
	Finds a div with the given search text, then prints the text inside
	all direct child divs of its grandparent div.

	:param soup: BeautifulSoup object of the HTML content
	:param search_text: Text to search for in a div
	"""
	# Find the div with the specified text
	target_div = soup.find('div', string=search_text)
	answer = ""
	# Check if the div is found
	if target_div:
		# Get the parent div
		parent_div = target_div.parent

		# Get the grandparent div
		grandparent_div = parent_div.parent if parent_div else None

		# Check if grandparent div is found
		if grandparent_div:
			# print(f"Text in direct child 'div' elements of the Grandparent Div of '{search_text}':")

			# Iterate through each child element inside the grandparent div
			for child in grandparent_div.children:
				# Check if the child is a 'div' and print its text
				if child.name == 'div':
					answer+=child.get_text(strip=True)

		else:
			# print("Grandparent div not found")
			return None
	else:
		# print(f"No div with '{search_text}' found")
		return None

if __name__ == '__main__':
	app.run(port=5000)
