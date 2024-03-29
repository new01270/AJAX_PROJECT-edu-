package com.yedam.book;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/PutBookDeleteServ")
public class PutBookDeleteServ extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public PutBookDeleteServ() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String no = request.getParameter("no"); 
		
		BookDAO bo = new BookDAO();
		bo.deleteBookList(Integer.parseInt(no));
		
		response.getWriter().append(no);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
