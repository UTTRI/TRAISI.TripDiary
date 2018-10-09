using Microsoft.AspNetCore.Mvc;
namespace TRAISI.Extensions.TripDiary
{
    public class TripDiaryController : Controller
    {

        private readonly TripDiaryService _tripDiaryService;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="tripDiaryService"></param>
        public TripDiaryController(TripDiaryService tripDiaryService)
        {
            this._tripDiaryService = tripDiaryService;
        }
        
    }
}