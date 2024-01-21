from flask import Flask, request
from flask_cors import CORS
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route('/receive_html', methods=['POST'])
def receive_html():
	html_data = request.data.decode('utf-8')
	print(type(html_data))
	sp=BeautifulSoup(html_data,'html.parser')
	st='Product Details'
	prod_dets = print_text_in_grandparent_div_childs(sp,st)
	if prod_dets == None:
		prod_dets = print_text_in_parent_div_childs(sp,st)
	specs = print_text_in_grandparent_div_childs(sp,'Specifications')
	if(specs == None):
		specs = print_text_in_parent_div_childs(sp,'Specifications')
	prod_desc = print_text_in_grandparent_div_childs(sp,'Product Description')
	if(prod_desc == None):
		prod_desc = print_text_in_parent_div_childs(sp,'Product Description')
	price = sp.find('div', {'class': '_30jeq3 _16Jk6d'}).text
	prod_name = sp.find('span', {'class': 'B_NuCI'}).text
	print(prod_name)
	print(price)
	print(prod_dets)
	print(specs)
	print(prod_desc)
	return 'OK'


def print_text_in_parent_div_childs(soup, search_text):
	"""
	Finds a div with the given search text, then prints the text inside
	all direct child divs of its grandparent div.

	:param soup: BeautifulSoup object of the HTML content
	:param search_text: Text to search for in a div
	"""
	# Find the div with the specified text
	target_div = soup.find('div', text=search_text)

	# Check if the div is found
	if target_div:
		# Get the parent div
		parent_div = target_div.parent

		# Get the grandparent div
		# grandparent_div = parent_div.parent if parent_div else None

		# Check if grandparent div is found
		if parent_div:
			print(f"Text in direct child 'div' elements of the Grandparent Div of '{search_text}':")
			answer = ""
			# Iterate through each child element inside the grandparent div
			for child in parent_div.children:
				# Check if the child is a 'div' and print its text
				if child.name == 'div':
					answer+=child.get_text(strip=True)

			return answer
		else:
			print("Grandparent div not found")
			return None
	else:
		print(f"No div with '{search_text}' found")
		return None

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
			print(f"Text in direct child 'div' elements of the Grandparent Div of '{search_text}':")

			# Iterate through each child element inside the grandparent div
			for child in grandparent_div.children:
				# Check if the child is a 'div' and print its text
				if child.name == 'div':
					answer+=child.get_text(strip=True)

		else:
			print("Grandparent div not found")
			return None
	else:
		print(f"No div with '{search_text}' found")
		return None

if __name__ == '__main__':
	app.run(port=5000)
