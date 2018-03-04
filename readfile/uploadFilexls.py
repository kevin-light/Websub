
import pymysql
import xlrd

def get_conn():
    conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='111111', db='wp_posts', charset='utf8')
    return conn

def insert(cur, sql, args):
    cur.execute(sql, args)

def read_xlsx_to_mysql(filename):
    excel = xlrd.open_workbook(filename)
    sheet = excel.sheet_by_index(0)
    conn = get_conn()
    cur = conn.cursor()

    sql = """insert into `wp_posts` (`post_author`, `post_date`, `post_date_gmt`, `post_content`,
`post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`,
`post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`,
`post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`,
`post_type`, `post_mime_type`, `comment_count`)
 values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
 %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
 %s,%s)"""

    for row in range(sheet.nrows):
        args = sheet.row_values(row)
        if row == 0:
            continue
        if args[5] is None or args[5] == '':
            continue

        if args[0]:
            args[0] = xlrd.xldate_as_datetime(args[0],0)

        insert(cur, sql, args=args[1:])
    conn.commit()
    cur.close()
    conn.close()

if __name__ == '__main__':
    read_xlsx_to_mysql('E://files//3-wp_posts.xlsx')

