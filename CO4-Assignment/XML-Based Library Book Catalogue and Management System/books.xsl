<?xml version="1.0" encoding="UTF-8"?>
<!--
  XML-Based Library Book Catalogue and Management System
  XSL Transformation Stylesheet - books.xsl
  Transforms XML book records into a responsive, styled HTML table
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <div class="xslt-transformed-container">
      <div class="xslt-meta-header">
        <div class="xslt-badge-group">
          <span class="xslt-badge xslt-badge-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Total Records: <xsl:value-of select="count(library/book)"/>
          </span>
          <span class="xslt-badge xslt-badge-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Generated via XSLT Engine
          </span>
        </div>
        <div class="xslt-summary-text">
          Displaying sorted records ordered alphabetically by Book Title using XPath expressions.
        </div>
      </div>

      <div class="xslt-table-responsive">
        <table class="xslt-table">
          <thead>
            <tr>
              <th scope="col">Book ID</th>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Publisher</th>
              <th scope="col">ISBN</th>
              <th scope="col" class="text-center">Year</th>
              <th scope="col" class="text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="library/book">
              <xsl:sort select="title" order="ascending"/>
              <tr>
                <td class="xslt-id-cell">
                  <span class="book-id-badge">
                    <xsl:value-of select="@id"/>
                  </span>
                </td>
                <td class="xslt-title-cell">
                  <strong><xsl:value-of select="title"/></strong>
                </td>
                <td class="xslt-author-cell">
                  <xsl:value-of select="author"/>
                </td>
                <td class="xslt-publisher-cell">
                  <xsl:value-of select="publisher"/>
                </td>
                <td class="xslt-isbn-cell">
                  <code><xsl:value-of select="isbn"/></code>
                </td>
                <td class="text-center xslt-year-cell">
                  <span class="year-pill"><xsl:value-of select="year"/></span>
                </td>
                <td class="text-right xslt-price-cell">
                  <span class="price-pill">₹<xsl:value-of select="price"/></span>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
          <tfoot>
            <tr class="xslt-tfoot-row">
              <td colspan="5">
                <strong>Catalogue Summary:</strong> 
                Total <xsl:value-of select="count(library/book)"/> Books catalogued across multiple CS disciplines.
              </td>
              <td class="text-center">
                <strong>Average:</strong>
              </td>
              <td class="text-right">
                <strong class="price-highlight">
                  ₹<xsl:value-of select="format-number(sum(library/book/price) div count(library/book), '0.00')"/>
                </strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </xsl:template>

</xsl:stylesheet>
